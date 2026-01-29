import { NextResponse } from "next/server";
import { createMessage, getMessages } from "@/lib/services/messages";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Gère l'envoi d'un nouveau message via le formulaire de contact.
 * Accessible publiquement.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation basique
    if (!body.name || !body.email || !body.content) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const message = await createMessage({
      name: body.name,
      email: body.email,
      subject: body.subject || "Nouveau message du portfolio",
      content: body.content,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du message." },
      { status: 500 }
    );
  }
}

/**
 * Récupère la liste des messages.
 * Requiert une authentification administrateur.
 */
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}
