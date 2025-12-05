import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { loginRoutes } from './routes/loginRoutes.js';
import { router as carRoutes } from './routes/carRoutes.js';
import { authRoutes } from './routes/authRoutes.js';

const app = express();
app.use(express.json());

// Base routes
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api', authRoutes); // Now GET /api/authenticate requires a valid Bearer token

app.get('/', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));