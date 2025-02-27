import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const embeddings = await dbService.getAllEmbeddings();
    return NextResponse.json(embeddings);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch embeddings: ${error}` },
      { status: 500 }
    );
  }
}
