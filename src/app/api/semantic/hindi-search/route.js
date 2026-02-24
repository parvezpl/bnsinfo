import { NextResponse } from 'next/server';
import { EMBEDDING_MODEL, getEmbedding } from '@/lib/embedding';
import { getQdrantClient, QDRANT_COLLECTION } from '@/lib/qdrant';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = String(body?.text || body?.query || '').trim();
    const limit = Math.min(
      20,
      Math.max(1, Number.isFinite(Number(body?.limit)) ? Number(body.limit) : 8)
    );

    if (!text) {
      return NextResponse.json(
        { ok: false, error: 'text is required' },
        { status: 400 }
      );
    }

    const minScore = Math.max(
      0,
      Math.min(
        1,
        Number.isFinite(Number(body?.minScore)) ? Number(body.minScore) : 0.35
      )
    );

    const vector = await getEmbedding(text);
    if (!Array.isArray(vector) || !vector.length) {
      return NextResponse.json(
        { ok: false, error: 'Embedding generation failed.' },
        { status: 500 }
      );
    }

    const client = getQdrantClient();
    const rawResults = await client.search(QDRANT_COLLECTION, {
      vector,
      limit,
      with_payload: true,
      with_vector: false,
    });
    const searchResult = rawResults.filter(
      (item) => Number(item?.score || 0) >= minScore
    );

    return NextResponse.json({
      ok: true,
      collection: QDRANT_COLLECTION,
      embeddingModel: EMBEDDING_MODEL,
      minScore,
      searchResult,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Semantic search failed.' },
      { status: 500 }
    );
  }
}
