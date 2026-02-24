import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || process.env.QDRANT_HOST;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || undefined;
export const QDRANT_COLLECTION =
  process.env.QDRANT_COLLECTION || 'bns_hindi_vectors';

let client;

export function getQdrantClient() {
  if (!QDRANT_URL) {
    throw new Error('Missing QDRANT_URL (or QDRANT_HOST) environment variable.');
  }

  if (!client) {
    client = new QdrantClient({
      url: QDRANT_URL,
      apiKey: QDRANT_API_KEY,
      checkCompatibility: false,
    });
  }

  return client;
}
