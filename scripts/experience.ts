import sharp from "sharp";

/**
 * Creates a composite image from vertical slices of multiple source images
 * @param {string[]} imagePaths - Array of paths to input images (should be 8 images)
 * @param {string} outputPath - Path where the composite image will be saved
 * @param {number} outputSize - Width and height of the output square image
 */
export const createSlicedImage = async (
  imagePaths: string[],
  outputPath: string,
  outputSize: number = 1024
): Promise<void> => {
  if (imagePaths.length !== 8) {
    throw new Error("This script requires exactly 8 input images");
  }

  // Calculate width of each slice
  const sliceWidth: number = Math.floor(outputSize / imagePaths.length);

  // Prepare composite elements
  const compositeElements: sharp.OverlayOptions[] = [];

  for (let i = 0; i < imagePaths.length; i++) {
    const inputPath: string = imagePaths[i];
    console.log(`Processing image ${i + 1}: ${inputPath}`);

    try {
      let sliceBuffer;

      // Try the safer approach - resize to exact dimensions first
      try {
        // Create a slice directly at the right dimensions with fit=cover
        sliceBuffer = await sharp(inputPath)
          .resize({
            width: sliceWidth,
            height: outputSize,
            fit: "cover",
            position: "center",
          })
          .toBuffer();

        console.log(`  Processed with direct resize approach`);
      } catch (resizeError) {
        // If that fails, log and try a fallback method
        if (resizeError instanceof Error) {
          console.warn(`  First approach failed: ${resizeError.message}`);
        }

        // Fallback method - crop with exact dimensions
        sliceBuffer = await sharp(inputPath)
          .resize({
            width: sliceWidth * 2, // Make it wider than needed
            height: outputSize,
            fit: "cover",
          })
          .extract({
            left: Math.floor(sliceWidth / 2), // Extract from middle
            top: 0,
            width: sliceWidth,
            height: outputSize,
          })
          .toBuffer();

        console.log(`  Processed with fallback method`);
      }

      // Add to composite elements with proper position
      compositeElements.push({
        input: sliceBuffer,
        left: i * sliceWidth,
        top: 0,
      });

      console.log(`  Slice added successfully`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `  Error processing image ${inputPath}: ${error.message}`
        );
      } else {
        console.error(
          `  Error processing image ${inputPath}: ${String(error)}`
        );
      }
      throw error;
    }
  }

  // Create blank canvas of the desired size
  await sharp({
    create: {
      width: outputSize,
      height: outputSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    // Composite all slices onto the canvas
    .composite(compositeElements)
    .png()
    .toFile(outputPath);

  console.log(`Composite image saved to ${outputPath}`);
};

const main = async () => {};

main();
