import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma.js';

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

// List all users (no passwords)
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
    res.json(users);
  } catch (e) {
    console.error('userController.getUsers error', e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by id (no password)
export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    console.error('userController.getUserById error', e);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create user (hash password)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, isActive } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const hashed = await bcrypt.hash(String(password), 12);
    const data: any = {
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email).toLowerCase(),
      password: hashed,
    };
    if (role !== undefined) data.role = String(role).toUpperCase();
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    const created = await prisma.user.create({ data, select: userSelect });
    res.status(201).json(created);
  } catch (e: any) {
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Email already in use' });
    console.error('userController.createUser error', e);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user (hash password if provided)
export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const { firstName, lastName, email, password, role, isActive } = req.body;
    const data: any = {};
    if (firstName !== undefined) data.firstName = String(firstName);
    if (lastName !== undefined) data.lastName = String(lastName);
    if (email !== undefined) data.email = String(email).toLowerCase();
    if (role !== undefined) data.role = String(role).toUpperCase();
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (password !== undefined) data.password = await bcrypt.hash(String(password), 12);
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });
    const updated = await prisma.user.update({ where: { id }, data, select: userSelect });
    res.json(updated);
  } catch (e: any) {
    if (e?.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    if (e?.code === 'P2002') return res.status(409).json({ error: 'Email already in use' });
    console.error('userController.updateUser error', e);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const deleted = await prisma.user.delete({ where: { id }, select: { id: true } });
    res.json(deleted);
  } catch (e: any) {
    if (e?.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    console.error('userController.deleteUser error', e);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
