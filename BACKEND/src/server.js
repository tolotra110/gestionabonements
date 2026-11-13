import app from './app.js';
import dotenv from 'dotenv';
import { pool } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

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

