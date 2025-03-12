// ontothesia-manager/services/prisma.ts

import { PrismaClient } from "@ontothesia/prisma";

declare global {
  // Ensure we don't redeclare the prisma client in dev mode (Next.js might reload modules)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    // log: ["query"], // optionally log queries in dev
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
