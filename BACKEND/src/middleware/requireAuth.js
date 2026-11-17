import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const COOKIE_NAME = 'anjoma_session';

const unauthorized = (res) => res.status(401).json({ message: 'Authentification requise' });

export const requireAuth = async (req, res, next) => {
  const cookie = req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const token = cookie?.slice(COOKIE_NAME.length + 1);
  if (!token) return unauthorized(res);

  let payload;
  try {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret || secret.length < 32) {
      return res.status(500).json({ message: 'Configuration d’authentification invalide' });
    }
    payload = jwt.verify(token, secret, {
      issuer: 'anjoma-api',
      audience: 'anjomacenter',
    });
  } catch {
    return unauthorized(res);
  }

  if (typeof payload !== 'object' || !payload.sub) return unauthorized(res);

  try {
    const { rows } = await query(
      'SELECT id, email FROM auth_users WHERE id = $1 AND is_active = TRUE',
      [payload.sub]
    );
    if (rows.length === 0) return unauthorized(res);
    req.user = { id: Number(rows[0].id), email: rows[0].email };
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de vérifier la session' });
  }
};
