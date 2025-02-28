import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).send("Missing or invalid URL parameter");
  }

  try {
    // Add user-agent to avoid being blocked by some servers
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; YourApp/1.0)",
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.startsWith("image/")) {
      return res.status(400).send("URL does not point to an image");
    }

    // Forward the image data and content type
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow CORS

    // Pipe the image data to the response
    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.status(500).send("Error proxying image");
  }
}
