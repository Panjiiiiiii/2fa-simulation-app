import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // harus pakai var, bukan let/const
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn", "info"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
