import { dbService } from "@/services/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const generations = await dbService.getAllGenerations();
    return NextResponse.json(generations);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch generations: ${error}` },
      { status: 500 }
    );
  }
}
