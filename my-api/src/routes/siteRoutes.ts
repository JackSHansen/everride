import { Router } from 'express';
import { carsRoutes } from './carsRoutes.js';
import { branchesRoutes } from './branchesRoutes.js';
import { pagesRoutes } from './pagesRoutes.js';

const router = Router();

// Mount sektioner
router.use('/cars', carsRoutes);
router.use('/branches', branchesRoutes);
router.use('/', pagesRoutes);

export const siteRoutes = router;
