import express from 'express';
import { getParametres, updateParametres } from '../controllers/parametreController.js';

const router = express.Router();

router.route('/').get(getParametres).put(updateParametres);

export default router;
