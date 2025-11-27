import { Router } from 'express';
import { getRecords, createRecord, getRecordById } from '../controllers/brandController.js';

const router = Router();
router.get('/', getRecords);
router.post('/', createRecord);
router.get('/:id', getRecordById);

export const apiBrandsRoutes = router;
