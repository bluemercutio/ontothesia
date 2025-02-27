import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const artefacts = await dbService.getAllArtefacts();
    return NextResponse.json(artefacts);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch artefacts: ${error}` },
      { status: 500 }
    );
  }
}
