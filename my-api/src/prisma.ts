import { PrismaClient } from "@prisma/client";

// Initialiser én delt PrismaClient til hele appen
export const prisma = new PrismaClient();