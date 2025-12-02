import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = Router();

// GET /api/users -> alle users
router.get('/', getUsers);

// GET /api/users/:id -> én user
router.get('/:id', getUserById);

// POST /api/users -> skapa en ny user
router.post('/', createUser);

// PUT /api/users/:id -> uppdatera en user
router.put('/:id', updateUser);

// DELETE /api/users/:id -> ta bort en user
router.delete('/:id', deleteUser);

export default router;