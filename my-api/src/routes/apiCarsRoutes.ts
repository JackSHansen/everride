import { Router } from 'express';
import { getRecords, createRecord, getRecordById, createWithRelations } from '../controllers/carController.js';

const router = Router();

// GET /api/cars -> liste
router.get('/', getRecords);

// POST /api/cars -> opret med brandId/categoryId
router.post('/', createRecord);

// POST /api/cars/with-relations -> opret brand + category ved navn og forbind bilen
router.post('/with-relations', createWithRelations);

// GET /api/cars/:id -> detaljer
router.get('/:id', getRecordById);

export const apiCarsRoutes = router;
