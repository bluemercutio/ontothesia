import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  try {
    const experience = await dbService.getExperienceById(resolvedParams.id);

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch experience: ${error}` },
      { status: 500 }
    );
  }
}
