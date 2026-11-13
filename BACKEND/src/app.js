import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes.js';
import abonnementRoutes from './routes/abonnementRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AnjomaCenter API' });
});

app.use('/api/clients', clientRoutes);
app.use('/api/abonnements', abonnementRoutes);

export default app;

