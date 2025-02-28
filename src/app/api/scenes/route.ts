import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scenes = await dbService.getAllScenes();
    return NextResponse.json(scenes);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch scenes: ${error}` },
      { status: 500 }
    );
  }
}
