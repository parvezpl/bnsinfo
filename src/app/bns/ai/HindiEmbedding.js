import { pipeline } from '@xenova/transformers';

// Basic Hindi stopwords list (can be expanded)
const hindiStopwords = [
    'और', 'का', 'में', 'की', 'है', 'यह', 'कि', 'से', 'था', 'पर', 'को', 'हैं', 'कर', 'गया',
    'ने', 'तो', 'ही', 'भी', 'हो', 'इसके', 'थी', 'रहा', 'दिया', 'एक', 'मैं', 'वे', 'तथा',
    'उस', 'इसी', 'यदि', 'लेकिन', 'या', 'अपने', 'उनके', 'जैसे', 'जब', 'तक', 'कभी', 'क्योंकि',
    'कौन', 'क्या', 'किसने', 'किसका', 'किसके', 'कैसे', 'कहाँ', 'कब', 'हूँ', 'रही', 'रहे'
];

// Hindi punctuation marks and common symbols
const punctuationRegex = /[।.,\/#!$%\^&\*;:{}=\-_`~()\"']/g;
// Function to clean Hindi text: remove punctuation, numbers, extra spaces
function cleanHindiText(text) {
    // Remove punctuation and numbers
    let cleanedText = text.replace(punctuationRegex, ' ');

    // Remove extra spaces
    cleanedText = cleanedText.replace(/\s{2,}/g, ' ').trim();

    return cleanedText;
}

// Remove Hindi stopwords
function removeHindiStopwords(text) {
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => !hindiStopwords.includes(word));
    return filteredWords.join(' ');
}

// Split text into chunks for model processing
function splitHindiText(text, maxChunkSize = 256) {
    let chunks = [];
    for (let i = 0; i < text.length; i += maxChunkSize) {
        chunks.push(text.slice(i, i + maxChunkSize));
    }
    return chunks;
}

// Main Hindi embedding function
async function getHindiEmbedding(texts) {
    // console.log("Original Hindi Text:", texts);

    // Clean text: punctuation, numbers, extra spaces
    let cleanedText = cleanHindiText(texts);
    // console.log("After Cleaning:", cleanedText);

    // Remove stopwords
    let textWithoutStopwords = removeHindiStopwords(cleanedText);
    // console.log("After Stopword Removal:", textWithoutStopwords);

    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const chunks = splitHindiText(textWithoutStopwords);
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
