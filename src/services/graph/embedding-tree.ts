// buildEmbeddingTree.ts
import { Embedding } from "@/types/embedding";
import { findTopMatches } from "../similarity/similarity";

/**
 * Represents a node in the embedding tree.
 * Each node stores:
 * - basic info (id, similarity, optional text/embedding)
 * - children: array of more EmbeddingTreeNodes
 */
export interface EmbeddingTreeNode {
  id: string;
  text?: string;
  similarity: number; // similarity relative to the parent's embedding
  children: EmbeddingTreeNode[];
}

/**
 * Recursively builds a tree of embeddings, starting from a given item,
 * finding the top matches for each level, and branching out up to a
 * specified depth. Uses both a path-specific and global visited set to avoid cycles.
 *
 * @param currentItem - The item that starts this subtree
 * @param allItems - The complete list of possible items to match against
 * @param topN - How many children to include at each level
 * @param depth - How many levels deep to recurse
 * @param pathVisited - A set of item IDs that have already been used in this path
 * @param globalVisited - A set of all item IDs that have been used in any path
 * @returns A tree node with children
 */
export const buildEmbeddingTree = (
  currentItem: Embedding,
  allItems: Embedding[],
  topN: number,
  depth: number,
  pathVisited: Set<string> = new Set(),
  globalVisited: Set<string> = new Set()
): EmbeddingTreeNode => {
  // Base cases:
  // 1. If we've reached depth 0
  // 2. If we've used too many nodes globally (prevent exponential growth)
  // 3. If we have no more valid candidates
  if (depth <= 0 || globalVisited.size >= allItems.length * 0.75) {
    return {
      id: currentItem.id,
      similarity: 1.0,
      children: [],
    };
  }

  // Mark this node as globally visited
  globalVisited.add(currentItem.id);

  // Find top matches for the current item (excluding items in current path and global visited)
  const candidates = allItems.filter(
    (item) =>
      item.id !== currentItem.id &&
      !pathVisited.has(item.id) &&
      !globalVisited.has(item.id)
  );

  // If no valid candidates left, return leaf node
  if (candidates.length === 0) {
    return {
      id: currentItem.id,
      similarity: 1.0,
      children: [],
    };
  }

  const THRESHOLD = 0.8;
  const matches = findTopMatches(currentItem, candidates, 50)
    .filter((match) => match.similarity >= THRESHOLD)
    .slice(0, topN);

  // For each child, create a new pathVisited set that includes the current path
  const children = matches.map((match) => {
    const newPathVisited = new Set(pathVisited);
    newPathVisited.add(currentItem.id);
    return {
      ...buildEmbeddingTree(
        match,
        allItems,
        topN,
        depth - 1,
        newPathVisited,
        globalVisited
      ),
      similarity: match.similarity,
    };
  });

  return {
    id: currentItem.id,
    similarity: 1.0,
    children,
  };
};
