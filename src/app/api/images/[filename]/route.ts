import { NextResponse, NextRequest } from "next/server";
import { getSignedUrlForFile } from "@ontothesia/storage";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    // Assuming images are stored in an "images" folder in the DO Spaces bucket
    const key = `images/${filename}`;

    // Generate a signed URL with 1-hour expiration (default)
    const signedUrl = await getSignedUrlForFile(key);

    // Redirect the user to the signed URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch image: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
