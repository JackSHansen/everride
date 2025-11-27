import express from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes.js';
import { siteRoutes } from './routes/siteRoutes.js';
// Tilføjet: api routes
import { apiCarsRoutes } from './routes/apiCarsRoutes.js';
import { apiBrandsRoutes } from './routes/apiBrandsRoutes.js';
import { apiCategoriesRoutes } from './routes/apiCategoriesRoutes.js';

// Indlæs miljøvariabler fra .env (uden at vise logs)
dotenv.config({ quiet: true });

// Brug port fra .env eller falde tilbage til 4000
const port = process.env.serverport || 4000;

// Opret express-app
const app = express();

// Gør det muligt at modtage JSON i requests
app.use(express.json());

// Gør det muligt at modtage form-data (fx fra formularer)
app.use(express.urlencoded({ extended: true }));

// Brug site-routes (forside, cars, branches, about, contact osv.)
app.use('/', siteRoutes);

// Brug vores user-routes under /api/users
app.use('/api/users', userRoutes);

// Tilføjet: mount nye API-routes
app.use('/api/cars', apiCarsRoutes);
app.use('/api/brands', apiBrandsRoutes);
app.use('/api/categories', apiCategoriesRoutes);

// 404 middleware — skelner mellem API og side-forespørgsler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(404).send(`
    <h1>404 - Siden blev ikke fundet</h1>
    <p>Prøv <a href="/">forsiden</a></p>
  `);
});

// Error-handling middleware
app.use((err: any, req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  if (req.originalUrl && req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  res.status(500).send('<h1>500 - Internal Server Error</h1>');
});

// Start serveren
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});