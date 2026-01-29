import prisma from "@/lib/prisma";
import { Message } from "@/prisma/generated";

/**
 * Enregistre un nouveau message dans la base de données.
 * 
 * @param {Omit<Message, 'id' | 'createdAt'>} data Les données du message (nom, email, sujet, contenu).
 * @returns {Promise<Message>} Le message créé.
 */
export const createMessage = async (data: {
  name: string;
  email: string;
  subject?: string;
  content: string;
}) => {
  return await prisma.message.create({
    data,
  });
};

/**
 * Récupère tous les messages reçus, triés par date de création (du plus récent au plus ancien).
 * Requiert généralement des droits d'administrateur pour être appelé.
 * 
 * @returns {Promise<Message[]>} La liste des messages.
 */
export const getMessages = async () => {
  return await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Supprime un message par son identifiant.
 * 
 * @param {string} id L'identifiant du message à supprimer.
 * @returns {Promise<Message>} Le message supprimé.
 */
export const deleteMessage = async (id: string) => {
  return await prisma.message.delete({
    where: { id },
  });
};
