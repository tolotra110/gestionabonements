import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const COOKIE_NAME = 'anjoma_session';
const SESSION_SECONDS = 8 * 60 * 60;

const getSecret = () => {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_TOKEN_SECRET doit contenir au moins 32 caractères');
  }
  return secret;
};

const setSessionCookie = (res, token) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_SECONDS}${secure}`
  );
};

export const login = async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!email || !password || email.length > 254 || password.length > 1024) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const { rows } = await query(
      'SELECT id, email, password_hash, is_active FROM auth_users WHERE email = $1',
      [email]
    );
    const user = rows[0];
    const passwordValide = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;
    if (!user || !user.is_active || !passwordValide) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = jwt.sign({ sub: String(user.id) }, getSecret(), {
      expiresIn: SESSION_SECONDS,
      issuer: 'anjoma-api',
      audience: 'anjomacenter',
    });
    setSessionCookie(res, token);
    res.json({ user: { id: Number(user.id), email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Impossible de se connecter' });
  }
};

export const currentUser = (req, res) => {
  res.json({ user: req.user });
};

export const logout = (_req, res) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`
  );
  res.status(204).end();
};
