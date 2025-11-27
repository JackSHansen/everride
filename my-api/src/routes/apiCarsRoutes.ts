import { Router } from 'express';
import { getRecords, createRecord } from '../controllers/carController.js';

const router = Router();
router.get('/', getRecords);
router.post('/', createRecord);

export const apiCarsRoutes = router;
