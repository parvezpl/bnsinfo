import { pipeline } from '@xenova/transformers';

let embedderPromise = null;
async function getEmbedder() {
    if (!embedderPromise) {
        embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return await embedderPromise;
}

export function cleanText(text) {
    return text
        .toLowerCase()
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s]/gi, '')
        .trim();
}

export function removeStopwords(text) {
    const stopwords = ['the', 'is', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'this', 'that', 'of', 'for'];
    return text
        .split(' ')
        .filter(word => !stopwords.includes(word))
        .join(' ');
}

function splitByWords(text, chunkSize = 100) {
    const words = text.split(' ');
    let chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
}

async function getEmbedding(texts) {
    const embedder = await getEmbedder();

    const cleaned = cleanText(texts);
    const noStopwords = removeStopwords(cleaned);
    const chunks = splitByWords(noStopwords);

    const outputs = await Promise.all(
        chunks.map(chunk => embedder(chunk, { pooling: 'mean', normalize: true }))
    );

    const vectors = outputs.map(out => Array.from(out.data));

    const averageVector = vectors[0].map((_, i) =>
        vectors.reduce((sum, vec) => sum + vec[i], 0) / vectors.length
    );

    return averageVector;
}

export default getEmbedding;
