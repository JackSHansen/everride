import { Router } from 'express';
import { login } from '../controllers/loginController.js';

const router = Router();

router.post('/', login);

export { router as loginRoutes };
