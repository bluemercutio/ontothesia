import OpenAI from "openai";

/**
 * Reads the OpenAI API key from environment variables.
 * Make sure you have OPENAI_API_KEY set in your .env (or environment).
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Creates an embedding for a given input using a specified embedding model.
 *
 * @param input - The text (or array of text strings) to embed.
 * @param model - The OpenAI embedding model (e.g. "text-embedding-ada-002").
 * @returns The embedding(s) as a number array (or an array of arrays for multiple inputs).
 */
export const createEmbedding = async (
  input: string | string[],
  model = "text-embedding-ada-002"
): Promise<number[] | number[][]> => {
  try {
    const response = await openai.embeddings.create({
      model,
      input,
    });

    // If input is a single string, return a single embedding vector.
    // If input is an array, return an array of embedding vectors.
    const embeddings = response.data.map(
      (item: { embedding: number[] }) => item.embedding
    );

    return Array.isArray(input) ? embeddings : embeddings[0];
  } catch (error) {
    // Handle error (could be logging, rethrowing, etc.)
    throw error;
  }
};

/**
 * Creates a completion based on a given prompt, using a specified model.
 *
 * @param prompt - The text prompt for generating a completion.
 * @param model - The OpenAI completion model (e.g. "text-davinci-003").
 * @param maxTokens - The maximum number of tokens in the generated response.
 * @returns The text content of the completion.
 */
export const createCompletion = async (
  prompt: string,
  model = "text-davinci-003",
  maxTokens = 128
): Promise<string> => {
  try {
    const response = await openai.completions.create({
      model,
      prompt,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response.choices[0].text?.trim() ?? "";
  } catch (error) {
    // Handle error (could be logging, rethrowing, etc.)
    throw error;
  }
};
