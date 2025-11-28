import { Router } from 'express';
import { getRecords, createRecord, getRecordById } from '../controllers/brandController.js';

const router = Router();

// GET /api/brands -> liste
router.get('/', getRecords);

// POST /api/brands -> opret
router.post('/', createRecord);

// GET /api/brands/:id -> detaljer
router.get('/:id', getRecordById);

export const apiBrandsRoutes = router;
