import { Router } from 'express';
import { login, register, getMe, seedReset } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/seed-reset', seedReset);

// Protected routes
router.get('/me', authenticateToken, getMe);

export default router;
