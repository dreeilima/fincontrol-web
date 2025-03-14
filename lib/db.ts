import { prisma } from "./prisma";

if (!prisma) {
  throw new Error("Falha ao iniciar Prisma client");
}

export const db = prisma;
