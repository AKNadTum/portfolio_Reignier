import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

/**
 * Client d'authentification pour le côté client (React).
 * Configuré avec le plugin admin pour la gestion des rôles.
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
    plugins: [
        adminClient(),
    ]
})
