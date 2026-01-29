import { NextResponse } from "next/server";
import { deleteMessage } from "@/lib/services/messages";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Supprime un message.
 * Requiert une authentification administrateur.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du message" },
      { status: 500 }
    );
  }
}
