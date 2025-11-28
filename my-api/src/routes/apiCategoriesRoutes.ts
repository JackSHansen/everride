import { Router } from 'express';
import { getRecords, createRecord, getRecordById } from '../controllers/categoryController.js';

const router = Router();

// GET /api/categories -> liste
router.get('/', getRecords);

// POST /api/categories -> opret
router.post('/', createRecord);

// GET /api/categories/:id -> detaljer
router.get('/:id', getRecordById);

export const apiCategoriesRoutes = router;
