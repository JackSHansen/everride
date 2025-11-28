import { Router } from 'express';
import { branchesPage, jyllandPage, fynPage, sjaellandPage } from '../controllers/controllers.js';

const router = Router();

// GET /branches -> oversigt
router.get('/', branchesPage);

// GET /branches/jylland -> region
router.get('/jylland', jyllandPage);

// GET /branches/fyn -> region
router.get('/fyn', fynPage);

// GET /branches/sjaelland -> region
router.get('/sjaelland', sjaellandPage);

export const branchesRoutes = router;
