import express from 'express';
import {
  getPaiements,
  getPaiementsAbonnement,
  createPaiement,
  deletePaiement,
} from '../controllers/paiementController.js';

const router = express.Router();

router.route('/').get(getPaiements).post(createPaiement);
router.get('/abonnement/:id', getPaiementsAbonnement);
router.delete('/:id', deletePaiement);

export default router;
