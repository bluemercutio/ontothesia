import { Embedding } from "@arkology-studio/ontothesia-types/embedding";

/**
 * Calculates the cosine similarity between two numerical vectors.
 *
 * similarity = (A ⋅ B) / (|A| * |B|)
 *
 * @param vecA - First embedding (array of numbers).
 * @param vecB - Second embedding (array of numbers).
 * @returns A number in the range [-1, 1], where higher means more similar.
 */
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error("Vector size mismatch in cosineSimilarity()");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    // Avoid division by zero in degenerate cases
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Compares a query embedding against a list of existing embeddings,
 * returning the top N most similar items (by descending similarity).
 *
 * @param queryEmbedding - The embedding to compare (e.g. from a query).
 * @param existingEmbeddings - Array of objects { id, embedding, ... } to compare against.
 * @param topN - How many top matches to return.
 * @returns Array of items with { ...originalItem, similarity } in descending order.
 */
export const findTopMatches = (
  queryEmbedding: Embedding,
  existingEmbeddings: Embedding[],
  topN: number
): Array<Embedding & { similarity: number }> => {
  // Compute similarities
  const scored = existingEmbeddings.map((item) => {
    const similarity = cosineSimilarity(queryEmbedding.vector, item.vector);
    return {
      ...item,
      similarity,
    };
  });

  // Sort by highest similarity first
  scored.sort((a, b) => b.similarity - a.similarity);

  // Return the top N
  return scored.slice(0, topN);
};
