import { Router } from 'express';
import { getRecords, createRecord, getRecordById } from '../controllers/carController.js';

const router = Router();

// GET /api/cars -> liste
router.get('/', getRecords);

// POST /api/cars -> opret
router.post('/', createRecord);

// GET /api/cars/:id -> detaljer
router.get('/:id', getRecordById);

export const apiCarsRoutes = router;
