import { Router } from 'express';
import { getRecords, getRecordById } from '../controllers/controllers.js';

const router = Router();
router.get('/', getRecords);

// Tilføjet: hent enkelt bruger via id
router.get('/:id', getRecordById);

export const userRoutes = router;