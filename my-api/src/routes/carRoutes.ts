import { Router } from 'express';
import {
  getRecords,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
  createWithRelations,
} from '../controllers/carController.js';

const router = Router();

router.get('/', getRecords);
router.get('/:id', getRecordById);
router.post('/', createRecord);
router.post('/with-relations', createWithRelations);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export { router };
