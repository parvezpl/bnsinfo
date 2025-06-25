import { QdrantClient } from '@qdrant/js-client-rest';

console.log(process.env.QDRANT_URL)
const client = new QdrantClient({
    url: process.env.QDRANT_URL,  // Store URL in environment variable
    apiKey: process.env.QDRANT_API_KEY, // Store API key in environment variable
});

export default client;

