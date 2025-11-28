import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

// Hent alle brands (id, name) sorteret stigende efter navn
export const getRecords = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    res.json(brands);
  } catch (error) {
    console.error('brandController.getRecords error', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

// Opret et brand (kræver name) og returnér { id }
export const createRecord = async (req: Request, res: Response) => {
  try {
    const { name, logo } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const newBrand = await prisma.brand.create({ data: { name, logo: logo ?? null }, select: { id: true } });
    res.status(201).json({ id: newBrand.id });
  } catch (error) {
    console.error('brandController.createRecord error', error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

// Hent ét brand ud fra id (validerer id og håndterer 404)
export const getRecordById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    console.error('brandController.getRecordById error', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
};
