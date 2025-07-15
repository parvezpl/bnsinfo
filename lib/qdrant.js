import { QdrantClient } from '@qdrant/js-client-rest';


const client = new QdrantClient(
    { url: process.env.QDRANT_URL_LOCAL } ||
    {
        url: process.env.QDRANT_URL,  // Store URL in environment variable
        apiKey: process.env.QDRANT_API_KEY, // Store API key in environment variable
        // checkCompatibility: false,

    });
console.log('qdrent', 'connected')
export default client;

