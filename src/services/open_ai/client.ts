import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Reads the OpenAI API key from environment variables.
 * Make sure you have OPENAI_API_KEY set in your .env (or environment).
 */

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
): Promise<OpenAI.Embedding[]> => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.embeddings.create({
      model,
      input,
    });

    const embedding = response.data;

    return embedding;
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
  context: string
): Promise<string> => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "developer", content: context },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o",
      store: true,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error("Completion Error: No result found");
    }
    return result;
  } catch (error) {
    // Handle error (could be logging, rethrowing, etc.)
    throw error;
  }
};
