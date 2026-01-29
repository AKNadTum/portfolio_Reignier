import prisma from "@/lib/prisma";
import { Profile, Technique, ActionField, SocialLink } from "@/prisma/generated";

/**
 * Récupère le profil de l'artiste avec ses relations (techniques, domaines d'action, liens sociaux).
 * 
 * @returns {Promise<Profile | null>} Le profil trouvé ou null s'il n'existe pas.
 */
export const getProfile = async () => {
  return await prisma.profile.findFirst({
    include: {
      techniques: true,
      actionFields: true,
      socialLinks: true,
    },
  });
};

/**
 * Met à jour le profil existant ou en crée un nouveau s'il n'existe pas.
 * Gère également la mise à jour des relations en remplaçant les anciennes par les nouvelles.
 * 
 * @param {any} data Les données du profil à mettre à jour, incluant les relations.
 * @returns {Promise<Profile>} Le profil créé ou mis à jour.
 */
export const updateProfile = async (data: any) => {
  const profile = await prisma.profile.findFirst();
  
  const { techniques, actionFields, socialLinks, ...profileData } = data;

  if (!profile) {
    return await prisma.profile.create({
      data: {
        ...profileData,
        techniques: {
          create: techniques?.map((t: any) => ({ name: t.name })) || [],
        },
        actionFields: {
          create: actionFields?.map((af: any) => ({ name: af.name })) || [],
        },
        socialLinks: {
          create: socialLinks?.map((sl: any) => ({ platform: sl.platform, url: sl.url })) || [],
        },
      },
      include: {
        techniques: true,
        actionFields: true,
        socialLinks: true,
      },
    });
  }

  /**
   * Pour simplifier la mise à jour des listes, on supprime et recrée les relations.
   * Ici, on effectue une mise à jour simple du profil et on gère les relations
   * en remplaçant tout pour garantir la cohérence des données du portfolio.
   */
  
  return await prisma.profile.update({
    where: { id: profile.id },
    data: {
      ...profileData,
      techniques: techniques ? {
        deleteMany: {},
        create: techniques.map((t: any) => ({ name: t.name })),
      } : undefined,
      actionFields: actionFields ? {
        deleteMany: {},
        create: actionFields.map((af: any) => ({ name: af.name })),
      } : undefined,
      socialLinks: socialLinks ? {
        deleteMany: {},
        create: socialLinks.map((sl: any) => ({ platform: sl.platform, url: sl.url })),
      } : undefined,
    },
    include: {
      techniques: true,
      actionFields: true,
      socialLinks: true,
    },
  });
};
