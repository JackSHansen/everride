import { Router } from 'express';
import { carsPage, carsListPage, carDetailPage } from '../controllers/controllers.js';

const router = Router();

// /cars
router.get('/', carsPage);
// /cars/list
router.get('/list', carsListPage);
// /cars/:id
router.get('/:id', carDetailPage);

export const carsRoutes = router;
