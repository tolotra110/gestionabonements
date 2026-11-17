import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createInterface } from 'node:readline';
import { pool, query } from '../src/config/db.js';

dotenv.config();

const ask = (prompt) => {
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => readline.question(prompt, (answer) => {
    readline.close();
    resolve(answer);
  }));
};

const askHidden = (prompt) => new Promise((resolve, reject) => {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    reject(new Error('Lancez cette commande depuis un terminal interactif'));
    return;
  }

  let password = '';
  process.stdout.write(prompt);
  input.setRawMode(true);
  input.resume();
  input.setEncoding('utf8');

  const cleanup = () => {
    input.setRawMode(false);
    input.pause();
    input.removeListener('data', onData);
    process.stdout.write('\n');
  };
  const onData = (chunk) => {
    for (const character of chunk) {
      if (character === '\u0003') {
        cleanup();
        reject(new Error('Création annulée'));
        return;
      }
      if (character === '\r' || character === '\n') {
        cleanup();
        resolve(password);
        return;
      }
      if (character === '\u007f' || character === '\b') {
        password = Array.from(password).slice(0, -1).join('');
      } else if (character >= ' ') {
        password += character;
      }
    }
  };
  input.on('data', onData);
});

async function createUser() {
  const email = String(await ask('Email du compte administrateur : ')).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error('Adresse email invalide');
  }

  const password = await askHidden('Mot de passe (12 caractères minimum) : ');
  const confirmation = await askHidden('Confirmer le mot de passe : ');
  if (password.length < 12) throw new Error('Le mot de passe doit contenir au moins 12 caractères');
  if (password !== confirmation) throw new Error('Les mots de passe ne correspondent pas');

  const passwordHash = await bcrypt.hash(password, 12);
  await query(
    `INSERT INTO auth_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE
     SET password_hash = EXCLUDED.password_hash,
         is_active = TRUE,
         updated_at = NOW()`,
    [email, passwordHash]
  );
  console.log(`Compte prêt pour ${email}`);
}

createUser()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
