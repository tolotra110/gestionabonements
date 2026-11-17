import express from 'express';
import { currentUser, login, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAuth, currentUser);
router.post('/logout', logout);

export default router;
