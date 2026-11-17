import app from './app.js';
import dotenv from 'dotenv';
import { pool } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
if (!process.env.AUTH_TOKEN_SECRET || process.env.AUTH_TOKEN_SECRET.length < 32) {
  console.error('AUTH_TOKEN_SECRET must contain at least 32 characters');
  process.exit(1);
}

pool.query('SELECT 1')
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

