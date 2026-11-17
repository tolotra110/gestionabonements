import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes.js';
import abonnementRoutes from './routes/abonnementRoutes.js';
import parametreRoutes from './routes/parametreRoutes.js';
import paiementRoutes from './routes/paiementRoutes.js';
import caisseRoutes from './routes/caisseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { requireAuth } from './middleware/requireAuth.js';

dotenv.config();

const app = express();

const originsAutorises = new Set(
  (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || originsAutorises.has(origin)),
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AnjomaCenter API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', requireAuth, clientRoutes);
app.use('/api/abonnements', requireAuth, abonnementRoutes);
app.use('/api/parametres', requireAuth, parametreRoutes);
app.use('/api/paiements', requireAuth, paiementRoutes);
app.use('/api/caisse', requireAuth, caisseRoutes);

export default app;

