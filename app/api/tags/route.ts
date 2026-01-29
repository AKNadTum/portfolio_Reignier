import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }
}
