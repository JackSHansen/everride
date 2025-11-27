import { Router } from 'express';
import { branchesPage, jyllandPage, fynPage, sjaellandPage } from '../controllers/controllers.js';

const router = Router();

// /branches
router.get('/', branchesPage);
// /branches/jylland
router.get('/jylland', jyllandPage);
// /branches/fyn
router.get('/fyn', fynPage);
// /branches/sjaelland
router.get('/sjaelland', sjaellandPage);

export const branchesRoutes = router;
