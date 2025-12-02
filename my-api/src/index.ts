import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { loginRoutes } from './routes/loginRoutes.js';
import { router as carRoutes } from './routes/carRoutes.js'; // adjust if different

const app = express();
app.use(express.json());

// Base routes
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);

app.get('/', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));