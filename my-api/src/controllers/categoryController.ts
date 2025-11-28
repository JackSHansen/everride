import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

// Hent alle kategorier (id, name) sorteret faldende efter navn
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

// Opret en kategori (kræver name) og returnér { id }
export const createRecord = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const newCategory = await prisma.category.create({ data: { name }, select: { id: true } });
    res.status(201).json({ id: newCategory.id });
  } catch (error) {
    console.error('categoryController.createRecord error', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Hent én kategori ud fra id (validerer id og håndterer 404)
export const getRecordById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error('categoryController.getRecordById error', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};
