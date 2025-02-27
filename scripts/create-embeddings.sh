#!/usr/bin/env bash

# This script will:
# 1. Import artefacts from artefacts.ts
# 2. Create embeddings using openAiClient.ts
# 3. Generate embeddings.ts that exports an array of { id, text, embedding }

set -e  # Exit on error

npx