import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  request: Request,
  { params }: { params: { "file-name": string } }
) {
  try {
    if (!process.env.NEXT_PUBLIC_GENERATIONS_DIR) {
      throw new Error("NEXT_PUBLIC_GENERATIONS_DIR is not set");
    }

    const filename = decodeURIComponent(params["file-name"]);
    const filePath = path.join(
      process.env.NEXT_PUBLIC_GENERATIONS_DIR,
      filename
    );

    const fileBuffer = await fs.readFile(filePath);
    const image = fileBuffer;

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new NextResponse(image, {
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
