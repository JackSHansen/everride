import { Router } from 'express';
import { getRecords, getRecordById } from '../controllers/controllers.js';

const router = Router();

// GET /api/users -> alle users
router.get('/', getRecords);

// GET /api/users/:id -> én user
router.get('/:id', getRecordById);

export const userRoutes = router;