import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins"


/**
 * Configuration de Better-Auth pour l'application.
 * Utilise l'adaptateur Prisma avec PostgreSQL, active l'authentification par e-mail/mot de passe,
 * et inclut les plugins pour la gestion administrative et les cookies Next.js.
 */
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        admin(),
        nextCookies()
    ],
});
