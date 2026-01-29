import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware de protection des routes.
 * Redirige vers /login si un utilisateur non authentifié tente d'accéder à /admin.
 * Redirige vers /admin si un utilisateur authentifié tente d'accéder à /login.
 * 
 * @param {NextRequest} request La requête entrante.
 * @returns {Promise<NextResponse>} La réponse de redirection ou la suite de la chaîne.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  
  return NextResponse.next();
}

/**
 * Configuration du matcher pour le middleware.
 * S'applique aux routes d'administration et à la page de connexion.
 */
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
