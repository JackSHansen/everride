import { Router } from 'express';
import { carsPage, carsListPage, carDetailPage } from '../controllers/controllers.js';

const router = Router();

// GET /cars -> oversigt
router.get('/', carsPage);

// GET /cars/list -> listevisning
router.get('/list', carsListPage);

// GET /cars/:id -> detaljer (demo)
router.get('/:id', carDetailPage);

export const carsRoutes = router;
