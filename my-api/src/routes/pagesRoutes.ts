import { Router } from 'express';
import { homePage, aboutPage, contactPage, contactSubmit } from '../controllers/controllers.js';

const router = Router();

// /  (forside)
router.get('/', homePage);

// /about
router.get('/about', aboutPage);

// /contact (GET form + POST submit)
router.get('/contact', contactPage);
router.post('/contact', contactSubmit);

export const pagesRoutes = router;
