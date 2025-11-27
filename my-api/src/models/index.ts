import { prisma } from '../prisma.js';

// Car wrappers
type CarCreateInput = {
  categoryId: number;
  brandId: number;
  model: string;
  year: number;
  price: number | string;
  fueltype: string;
};

export const Car = {
  findAll: () => prisma.car.findMany(),
  create: (data: CarCreateInput) => prisma.car.create({ data }),
};

// Brand wrappers
export const Brand = {
  findAll: () => prisma.brand.findMany(),
  create: (data: { name: string; logo?: string | null }) => prisma.brand.create({ data }),
};

// Category wrappers
export const Category = {
  findAll: () => prisma.category.findMany(),
  create: (data: { name: string }) => prisma.category.create({ data }),
};

export default { Car, Brand, Category };
