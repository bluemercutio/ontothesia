import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artefact = await dbService.getArtefactById(params.id);

    if (!artefact) {
      return NextResponse.json(
        { error: "Artefact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(artefact);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch artefact: ${error}` },
      { status: 500 }
    );
  }
}
