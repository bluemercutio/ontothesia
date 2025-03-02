import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/services/db/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; artefact_id: string }> }
) {
  try {
    // Use params directly in the async function call
    const params = await context.params;
    const embedding = await dbService.getEmbeddingByArtefactId(
      params.artefact_id
    );

    if (!embedding) {
      return NextResponse.json(
        { error: "Embedding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(embedding);
  } catch (error) {
    console.error("Error fetching embedding:", error);
    return NextResponse.json(
      { error: "Failed to fetch embedding" },
      { status: 500 }
    );
  }
}
