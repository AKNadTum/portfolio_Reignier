import { getProjectBySlug } from "@/lib/services/project";
import { getProfile } from "@/lib/services/portfolio";
import { notFound } from "next/navigation";
import ProjectClient from "./ProjectClient";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const profile = await getProfile();

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} profile={profile} />;
}
