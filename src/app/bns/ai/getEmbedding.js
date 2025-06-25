import { pipeline } from '@xenova/transformers';

export function cleanText(text) {
    return text
        .toLowerCase()                      // Convert to lowercase
        .replace(/[\r\n]+/g, ' ')           // Replace newlines with space
        .replace(/\s+/g, ' ')               // Replace multiple spaces with single space
        .replace(/[^\w\s]/gi, '')           // Remove punctuation (optional)
        .trim();                            // Trim leading/trailing spaces
}

export function removeStopwords(text) {
    const stopwords = ['the', 'is', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'this', 'that', 'of', 'for'];
    return text
        .split(' ')
        .filter(word => !stopwords.includes(word))
        .join(' ');
}

function splitText(text, chunkSize = 500) {
    let chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
}

async function getEmbedding(texts) {
    console.log("text", texts);

    const text = cleanText(texts);
    const noStopwords = removeStopwords(text);

    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const chunks = splitText(noStopwords);
    let vectors = [];

    for (let chunk of chunks) {
        const output = await embedder(chunk, { pooling: 'mean', normalize: true });
        vectors.push(Array.from(output.data));
    }

    // Average the vectors
    const averageVector = vectors[0].map((_, i) =>
        vectors.reduce((sum, vec) => sum + vec[i], 0) / vectors.length
    );

    return averageVector;
}

export default getEmbedding;



