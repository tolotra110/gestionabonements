import express from 'express';
import {
  getPaiements,
  getPaiement,
  getPaiementsAbonnement,
  createPaiement,
  deletePaiement,
} from '../controllers/paiementController.js';

const router = express.Router();

router.route('/').get(getPaiements).post(createPaiement);
router.get('/abonnement/:id', getPaiementsAbonnement);
router.route('/:id').get(getPaiement).delete(deletePaiement);

export default router;
