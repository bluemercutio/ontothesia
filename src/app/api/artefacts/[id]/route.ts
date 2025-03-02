import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/services/db/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const artefact = await dbService.getArtefactById(id);
    if (!artefact) {
      return NextResponse.json(
        { error: "Artefact not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(artefact);
  } catch (error) {
    console.error("Error fetching artefact:", error);
    return NextResponse.json(
      { error: "Failed to fetch artefact" },
      { status: 500 }
    );
  }
}
