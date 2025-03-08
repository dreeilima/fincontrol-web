import { PrismaClient } from "@prisma/client";

import "server-only";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

export const prisma = new PrismaClient();
export const db = prisma;
