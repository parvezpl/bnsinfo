import { pipeline } from '@xenova/transformers';

const hindiStopwords = [
    'और', 'का', 'में', 'की', 'है', 'यह', 'कि', 'से', 'था', 'पर', 'को', 'हैं', 'कर', 'गया',
    'ने', 'तो', 'ही', 'भी', 'हो', 'इसके', 'थी', 'रहा', 'दिया', 'एक', 'मैं', 'वे', 'तथा',
    'उस', 'इसी', 'यदि', 'था', 'लेकिन', 'या', 'अपने', 'उनके', 'जैसे', 'जब', 'तक', 'यदि',
    'कभी', 'क्योंकि', 'कौन', 'क्या', 'किसने', 'किसका', 'किसके', 'कैसे', 'कहाँ', 'कब', 'था',
    'थी', 'थे', 'हूँ', 'रही', 'रहे'
];

function removeHindiStopwords(text) {
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => !hindiStopwords.includes(word));
    return filteredWords.join(' ');
}

function splitHindiText(text, maxChunkSize = 256) {
    let chunks = [];
    for (let i = 0; i < text.length; i += maxChunkSize) {
        chunks.push(text.slice(i, i + maxChunkSize));
    }
    return chunks;
}

async function getHindiEmbedding(texts) {
    console.log("Original Hindi Text:", texts);
    const cleanText = removeHindiStopwords(texts);
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const chunks = splitHindiText(cleanText);
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

export default getHindiEmbedding;
