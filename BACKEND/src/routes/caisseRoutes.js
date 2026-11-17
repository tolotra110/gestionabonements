import express from 'express';
import {
  createOperationCaisse,
  deleteOperationCaisse,
  getOperationsCaisse,
  updateOperationCaisse,
} from '../controllers/caisseController.js';

const router = express.Router();

router.route('/').get(getOperationsCaisse).post(createOperationCaisse);
router.put('/:id', updateOperationCaisse);
router.delete('/:id', deleteOperationCaisse);

export default router;
