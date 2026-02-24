import { pipeline } from '@xenova/transformers';

let embedderPromise;
export const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL || 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', EMBEDDING_MODEL);
  }
  return embedderPromise;
}

function normalizeText(text = '') {
  return String(text)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s.,;:!?()\-[\]{}'"`]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitByWords(text, chunkSize = 120) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

export async function getEmbedding(text) {
  const cleaned = normalizeText(text);
  if (!cleaned) return [];

  const embedder = await getEmbedder();
  const chunks = splitByWords(cleaned);
  const outputs = await Promise.all(
    chunks.map((chunk) => embedder(chunk, { pooling: 'mean', normalize: true }))
  );

  const vectors = outputs.map((out) => Array.from(out.data));
  if (!vectors.length) return [];

  return vectors[0].map((_, i) => {
    const sum = vectors.reduce((acc, vec) => acc + vec[i], 0);
    return sum / vectors.length;
  });
}
