import { NextResponse, NextRequest } from "next/server";
import { getSignedUrlForFile } from "@ontothesia/storage";
import { DigitalOceanConfig } from "@ontothesia/types/digital_ocean";
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");

    console.log("Received request for:");
    console.log("Original filename:", filename);
    console.log("Folder:", folder);

    // Decode the filename in case it's URL encoded
    const decodedFilename = decodeURIComponent(filename);
    console.log("Decoded filename:", decodedFilename);

    if (
      !process.env.DO_SPACES_REGION ||
      !process.env.DO_SPACES_BUCKET ||
      !process.env.DO_SPACES_KEY ||
      !process.env.DO_SPACES_SECRET
    ) {
      throw new Error(
        "Missing required Digital Ocean Spaces environment variables"
      );
    }

    // Pass required environment variables explicitly to overcome the limitation
    const doConfig: DigitalOceanConfig = {
      DO_SPACES_REGION: process.env.DO_SPACES_REGION,
      DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
      DO_SPACES_KEY: process.env.DO_SPACES_KEY,
      DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
    };

    // Construct key with .png extension
    const key = `${folder}/${decodedFilename}`;
    console.log("Fetching image with key:", key);

    const signedUrl = await getSignedUrlForFile(key, 3600, doConfig);
    console.log("Generated signed URL:", signedUrl);

    // Fetch the image
    const imageResponse = await fetch(signedUrl);

    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch image from storage: ${imageResponse.status} for key ${key}`
      );
    }

    // Get the image data as an array buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      { error: `Failed to fetch image: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
