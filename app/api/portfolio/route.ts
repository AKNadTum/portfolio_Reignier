import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/services/portfolio";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Gère la récupération publique du profil du portfolio.
 * 
 * @returns {Promise<NextResponse>} Le profil au format JSON.
 */
export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

/**
 * Gère la mise à jour du profil du portfolio.
 * Requiert une authentification administrateur.
 * 
 * @param {Request} req La requête HTTP contenant les nouvelles données du profil.
 * @returns {Promise<NextResponse>} Le profil mis à jour ou une erreur.
 */
export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const profile = await updateProfile(body);
    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}
