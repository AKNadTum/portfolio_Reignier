// lib/prisma.ts
import { PrismaClient } from "@/prisma/generated";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// On informe TypeScript que l'objet global possède une propriété optionnelle prismaGlobal
declare global {
    var prismaGlobal: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (globalThis.prismaGlobal) {
    prisma = globalThis.prismaGlobal;
} else {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
    
    if (process.env.NODE_ENV !== "production") {
        globalThis.prismaGlobal = prisma;
    }
}

export default prisma;
