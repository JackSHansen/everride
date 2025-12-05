import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { getAuthenticatedUser } from '../controllers/authController.js';

const router = Router();

router.get('/authenticate', authenticateToken, getAuthenticatedUser);

export { router as authRoutes };
