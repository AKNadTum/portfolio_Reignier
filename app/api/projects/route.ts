import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/services/project";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const project = await createProject(body);
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating project" }, { status: 500 });
  }
}
