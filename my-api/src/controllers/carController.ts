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
