import prisma from "@/lib/prisma";
import { Project, Tag } from "@/prisma/generated";
import { unlink } from "fs/promises";
import path from "path";
import fs from "fs";

/**
 * Récupère tous les projets du portfolio, triés par date de création décroissante.
 * Inclut les tags associés à chaque projet.
 * 
 * @returns {Promise<Project[]>} La liste des projets.
 */
export const getProjects = async () => {
  return await prisma.project.findMany({
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Récupère un projet spécifique par son slug.
 * 
 * @param {string} slug Le slug unique du projet.
 * @returns {Promise<Project | null>} Le projet trouvé ou null.
 */
export const getProjectBySlug = async (slug: string) => {
  return await prisma.project.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  });
};

/**
 * Crée un nouveau projet et gère l'association des tags.
 * Effectue un nettoyage des tags orphelins après la création.
 * 
 * @param {any} data Les données du projet à créer.
 * @returns {Promise<Project>} Le projet créé.
 */
export const createProject = async (data: any) => {
  const { tags, ...projectData } = data;
  
  const project = await prisma.project.create({
    data: {
      ...projectData,
      tags: {
        connectOrCreate: tags?.map((tagName: string) => ({
          where: { name: tagName },
          create: { name: tagName },
        })) || [],
      },
    },
    include: {
      tags: true,
    },
  });

  await cleanupOrphanTags();
  return project;
};

/**
 * Met à jour un projet existant et ses tags.
 * Effectue un nettoyage des tags orphelins après la mise à jour.
 * 
 * @param {string} id L'identifiant unique du projet.
 * @param {any} data Les nouvelles données du projet.
 * @returns {Promise<Project>} Le projet mis à jour.
 */
export const updateProject = async (id: string, data: any) => {
  const { tags, ...projectData } = data;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      tags: tags ? {
        set: [],
        connectOrCreate: tags.map((tagName: string) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      } : undefined,
    },
    include: {
      tags: true,
    },
  });

  await cleanupOrphanTags();
  return project;
};

/**
 * Supprime un projet par son identifiant.
 * Supprime également l'image associée du système de fichiers.
 * Effectue un nettoyage des tags orphelins après la suppression.
 * 
 * @param {string} id L'identifiant du projet à supprimer.
 * @returns {Promise<Project>} Le projet supprimé.
 */
export const deleteProject = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (project?.image && project.image.startsWith("/uploads/")) {
    const filename = project.image.split("/").pop();
    if (filename) {
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      try {
        if (fs.existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error("Error deleting project image:", error);
      }
    }
  }

  const deletedProject = await prisma.project.delete({
    where: { id },
  });

  await cleanupOrphanTags();
  return deletedProject;
};

/**
 * Supprime tous les tags qui ne sont plus associés à aucun projet.
 * 
 * @returns {Promise<Prisma.BatchPayload>} Le résultat de la suppression.
 */
export const cleanupOrphanTags = async () => {
  return await prisma.tag.deleteMany({
    where: {
      projects: {
        none: {},
      },
    },
  });
};
