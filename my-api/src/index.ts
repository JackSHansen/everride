import express from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes.js';
import { siteRoutes } from './routes/siteRoutes.js';
import { apiCarsRoutes } from './routes/apiCarsRoutes.js';
import { apiBrandsRoutes } from './routes/apiBrandsRoutes.js';
import { apiCategoriesRoutes } from './routes/apiCategoriesRoutes.js';
import { updateRecord as updateCarRecord, deleteRecord as deleteCarRecord } from './controllers/carController.js';
import { prisma } from './prisma.js';

// Indlæs env variabler (port mm.)
dotenv.config({ quiet: true });

// Fald tilbage til 4000 hvis ingen port sat
const port = process.env.serverport || 4000;

const app = express();

// JSON body parsing
app.use(express.json());

// Form-url-encoded parsing
app.use(express.urlencoded({ extended: true }));

// Site routes (forside og statiske sider)
app.use('/', siteRoutes);

// API: users
app.use('/api/users', userRoutes);

// API: domæner (cars, brands, categories)
app.use('/api/cars', apiCarsRoutes);
app.use('/api/brands', apiBrandsRoutes);
app.use('/api/categories', apiCategoriesRoutes);

// Ekstra endpoints: PUT/DELETE for brands & categories (cars via controller)
app.put('/api/cars/:id', updateCarRecord);

app.put('/api/brands/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const { name, logo } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = String(name);
    if (logo !== undefined) data.logo = logo === null ? null : String(logo);
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });

    const updated = await prisma.brand.update({
      where: { id },
      data,
      select: { id: true, name: true, logo: true },
    });
    res.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Brand not found' });
    console.error('brands PUT error', error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const { name } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = String(name);
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });

    const updated = await prisma.category.update({
      where: { id },
      data,
      select: { id: true, name: true },
    });
    res.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    console.error('categories PUT error', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/cars/:id', deleteCarRecord);

app.delete('/api/brands/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const deleted = await prisma.brand.delete({
      where: { id },
      select: { id: true },
    });
    res.json(deleted);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Brand not found' });
    console.error('brands DELETE error', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const deleted = await prisma.category.delete({
      where: { id },
      select: { id: true },
    });
    res.json(deleted);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    console.error('categories DELETE error', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// 404: returnér JSON for API, HTML for sider
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.status(404).send(`
    <h1>404 - Siden blev ikke fundet</h1>
    <p>Prøv <a href="/">forsiden</a></p>
  `);
});

// Global error handler
app.use((err: any, req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  if (req.originalUrl && req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  res.status(500).send('<h1>500 - Internal Server Error</h1>');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});