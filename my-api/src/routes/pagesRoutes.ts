import { Router } from 'express';
import { homePage, aboutPage, contactPage, contactSubmit } from '../controllers/controllers.js';

const router = Router();

// Forside
router.get('/', homePage);

// Om os
router.get('/about', aboutPage);

// Kontakt (GET viser form, POST sender)
router.get('/contact', contactPage);
router.post('/contact', contactSubmit);

export const pagesRoutes = router;
