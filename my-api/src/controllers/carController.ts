import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany({
      select: {
        id: true,
        model: true,
        price: true,
        brand: { select: { name: true } },
      },
      orderBy: { price: 'desc' },
    });

    const list = cars.map((c) => ({
      id: c.id,
      brand: c.brand?.name ?? null,
      model: c.model,
      price: Number(c.price as any),
    }));

    res.json(list);
  } catch (error) {
    console.error('carController.getRecords error', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    const { categoryId, brandId, model, year, price, fueltype } = req.body;
    if (!categoryId || !brandId || !model || !year || !price || !fueltype) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newCar = await prisma.car.create({
      data: { categoryId: Number(categoryId), brandId: Number(brandId), model, year: Number(year), price: Number(price), fueltype },
      select: { id: true },
    });
    res.status(201).json({ id: newCar.id });
  } catch (error) {
    console.error('carController.createRecord error', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const car = await prisma.car.findUnique({
      where: { id },
      select: {
        id: true,
        model: true,
        price: true,
        brand: { select: { name: true } },
      },
    });
    if (!car) return res.status(404).json({ error: 'Car not found' });

    res.json({
      id: car.id,
      brand: car.brand?.name ?? null,
      model: car.model,
      price: Number(car.price as any),
    });
  } catch (error) {
    console.error('carController.getRecordById error', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const { categoryId, brandId, model, year, price, fueltype } = req.body;

    const data: any = {};
    if (categoryId !== undefined) data.categoryId = Number(categoryId);
    if (brandId !== undefined) data.brandId = Number(brandId);
    if (model !== undefined) data.model = String(model);
    if (year !== undefined) data.year = Number(year);
    if (price !== undefined) data.price = Number(price);
    if (fueltype !== undefined) data.fueltype = String(fueltype);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No updatable fields provided' });
    }

    const updated = await prisma.car.update({
      where: { id },
      data,
      select: { id: true, model: true, price: true, brandId: true, categoryId: true, fueltype: true, year: true },
    });

    res.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Car not found' });
    console.error('carController.updateRecord error', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const deleted = await prisma.car.delete({
      where: { id },
      select: { id: true },
    });
    res.json(deleted);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Car not found' });
    console.error('carController.deleteRecord error', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
};
