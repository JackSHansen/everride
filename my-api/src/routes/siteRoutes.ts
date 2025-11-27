import { Router } from 'express';
import { carsRoutes } from './carsRoutes.js';
import { branchesRoutes } from './branchesRoutes.js';
import { pagesRoutes } from './pagesRoutes.js';

const router = Router();

// Mount resource-routers
router.use('/cars', carsRoutes);
router.use('/branches', branchesRoutes);

// Pages (forside, about, contact) på root
router.use('/', pagesRoutes);

export const siteRoutes = router;
