import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    if (!process.env.NEXT_PUBLIC_GENERATIONS_DIR) {
      throw new Error("NEXT_PUBLIC_GENERATIONS_DIR is not set");
    }

    const { filename } = await context.params;
    const filePath = path.join(
      process.env.NEXT_PUBLIC_GENERATIONS_DIR,
      "images",
      filename
    );

    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch image: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
