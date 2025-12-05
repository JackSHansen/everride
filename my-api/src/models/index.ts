import { prisma } from '../prisma.js';
import { FuelType } from '@prisma/client';

// Simple wrappers til at efterligne Model.findAll/create signaturer

// Car wrappers
type CarCreateInput = {
  categoryId: number;
  brandId: number;
  model: string;
  year: number;
  price: number | string; // will normalize to string
  fueltype: FuelType;     // use enum to satisfy Prisma type
};

export const Car = {
  // Returnerer alle cars (rå prisma-respons)
  findAll: () => prisma.car.findMany(),
  // Opretter en ny car med givne felter
  create: (data: CarCreateInput) =>
    prisma.car.create({
      data: {
        ...data,
        // Prisma Decimal expects string or Decimal; convert numbers to string
        price: typeof data.price === 'number' ? data.price.toFixed(2) : data.price,
      },
    }),
};

// Brand wrappers
export const Brand = {
  // Alle brands
  findAll: () => prisma.brand.findMany(),
  // Opret brand
  create: (data: { name: string; logo?: string | null }) => prisma.brand.create({ data }),
};

// Category wrappers
export const Category = {
  // Alle kategorier
  findAll: () => prisma.category.findMany(),
  // Opret kategori
  create: (data: { name: string }) => prisma.category.create({ data }),
};

export default { Car, Brand, Category };
