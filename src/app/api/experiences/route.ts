import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const experiences = await dbService.getAllExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch experiences: ${error}` },
      { status: 500 }
    );
  }
}
