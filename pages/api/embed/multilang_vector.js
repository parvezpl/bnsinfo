import { pipeline } from '@xenova/transformers';

let embedder = null;

export async function getAIVector(text) {
    if (!embedder) {
        // embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        embedder = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
    }

    const vectors = await embedder(text, {
        pooling: 'mean',   // Average the token embeddings
        normalize: true    // Normalize the vector
    });

    
    return Array.from(vectors.data)

}
