import { Router } from 'express';
import { getRecords, createRecord } from '../controllers/brandController.js';

const router = Router();
router.get('/', getRecords);
router.post('/', createRecord);

export const apiBrandsRoutes = router;
