import { Router } from 'express';
import { getRecords, createRecord } from '../controllers/categoryController.js';

const router = Router();
router.get('/', getRecords);
router.post('/', createRecord);

export const apiCategoriesRoutes = router;
