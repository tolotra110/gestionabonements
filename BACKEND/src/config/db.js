import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types } = pg;

// Les colonnes DATE restent au format « AAAA-MM-JJ » au lieu d'être
// converties en Date JS, ce qui décalait les jours selon le fuseau horaire.
types.setTypeParser(1082, (valeur) => valeur);

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);