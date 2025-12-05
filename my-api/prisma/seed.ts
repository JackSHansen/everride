import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from '../src/prisma.js';
import { randomPriceString, randomYear, pickRandom } from '../src/utils/random.js';

const main = async () => {
  // Clear tables in FK-safe order
  await prisma.car.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.fueltype.deleteMany();
  await prisma.user.deleteMany();

  // Users (admin + user)
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!', 12),
      role: 'ADMIN',
      isActive: true,
    },
  });
  const basicUser = await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'User',
      email: 'user@example.com',
      password: await bcrypt.hash('User123!', 12),
      role: 'USER',
      isActive: true,
    },
  });
  console.log('Seeded users:', { admin: admin.id, user: basicUser.id });

  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Personbil' },
      { name: 'Varevogn' },
      { name: 'Lastbil' },
      { name: 'Autocamper' },
      { name: 'Andre' },
    ],
    skipDuplicates: true,
  });

  // Brands
  await prisma.brand.createMany({
    data: [
      { name: 'Tesla' },
      { name: 'Toyota' },
      { name: 'Ford' },
      { name: 'Volkswagen' },
      { name: 'Mercedes-Benz' },
      { name: 'Volvo' },
    ],
    skipDuplicates: true,
  });

  // Fueltypes table (model Fueltype -> prisma.fueltype)
  await prisma.fueltype.createMany({
    data: [
      { name: 'Benzin' },
      { name: 'Diesel' },
      { name: 'El' },
      { name: 'Hybrid' },
      { name: 'Andre' },
    ],
    skipDuplicates: true,
  });

  // Fetch FK ids
  const brands = await prisma.brand.findMany({ orderBy: { id: 'asc' } });
  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
  const byName = <T extends { name: string }>(arr: (T & { id: number })[], name: string) =>
    arr.find((x) => x.name === name)!;

  const tesla = byName(brands, 'Tesla');
  const toyota = byName(brands, 'Toyota');
  const ford = byName(brands, 'Ford');
  const vw = byName(brands, 'Volkswagen');
  const merc = byName(brands, 'Mercedes-Benz');
  const volvo = byName(brands, 'Volvo');

  const personbil = byName(categories, 'Personbil');
  const varevogn = byName(categories, 'Varevogn');
  const lastbil = byName(categories, 'Lastbil');
  const autocamper = byName(categories, 'Autocamper');
  const andre = byName(categories, 'Andre');

  // Cars (FuelType enum values) with random price/year
  const carBase = [
    { brandId: tesla.id, categoryId: personbil.id, model: 'Model 3', fueltype: 'ELECTRIC' },
    { brandId: tesla.id, categoryId: personbil.id, model: 'Model Y', fueltype: 'ELECTRIC' },
    { brandId: toyota.id, categoryId: personbil.id, model: 'Corolla', fueltype: 'PETROL' },
    { brandId: toyota.id, categoryId: varevogn.id, model: 'Proace', fueltype: 'DIESEL' },
    { brandId: ford.id, categoryId: varevogn.id, model: 'Transit', fueltype: 'DIESEL' },
    { brandId: ford.id, categoryId: personbil.id, model: 'Focus', fueltype: 'PETROL' },
    { brandId: vw.id, categoryId: personbil.id, model: 'Golf', fueltype: 'HYBRID' },
    { brandId: vw.id, categoryId: autocamper.id, model: 'California', fueltype: 'DIESEL' },
    { brandId: merc.id, categoryId: lastbil.id, model: 'Actros', fueltype: 'DIESEL' },
    { brandId: volvo.id, categoryId: lastbil.id, model: 'FH16', fueltype: 'DIESEL' },
    { brandId: merc.id, categoryId: personbil.id, model: 'C-Class', fueltype: 'PETROL' },
    { brandId: volvo.id, categoryId: personbil.id, model: 'XC40 Recharge', fueltype: 'ELECTRIC' },
  ];

  await prisma.car.createMany({
    data: carBase.map((c) => ({
      ...c,
      year: randomYear(2015, 2024),
      price: randomPriceString(12000, 96000), // string with 2 decimals
    })),
  });

  console.log('Seed completed: categories, brands, fueltypes, cars, users.');
};

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
