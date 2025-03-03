import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: Request) {
  const filename = request.url.split("/").pop(); // Get filename from URL

  try {
    const imageBuffer = await fs.readFile(
      path.join(process.cwd(), "prisma/data/generations", filename!)
    );
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch image: ${error}` },
      { status: 500 }
    );
  }
}
