import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const embedding = await dbService.getEmbeddingById(params.id);

    if (!embedding) {
      return NextResponse.json(
        { error: "Embedding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(embedding);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch embedding: ${error}` },
      { status: 500 }
    );
  }
}
