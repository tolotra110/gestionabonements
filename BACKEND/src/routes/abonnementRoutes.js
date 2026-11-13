import express from 'express';
import { getAbonnements, getAbonnement, createAbonnement, updateAbonnement, deleteAbonnement } from '../controllers/abonnementController.js';

const router = express.Router();

router.route('/').get(getAbonnements).post(createAbonnement);
router.route('/:id').get(getAbonnement).put(updateAbonnement).delete(deleteAbonnement);

export default router;
