import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'desc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('categoryController.getRecords error', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const newCategory = await Category.create({ name });
    res.status(201).json({ id: newCategory.get('id') });
  } catch (error) {
    console.error('categoryController.createRecord error', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};
