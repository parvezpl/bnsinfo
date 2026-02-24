import { NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/embedding';
import { getQdrantClient, QDRANT_COLLECTION } from '@/lib/qdrant';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = getQdrantClient();
    const info = await client.getCollection(QDRANT_COLLECTION);
    return NextResponse.json({
      ok: true,
      collection: QDRANT_COLLECTION,
      status: info?.status || null,
      vectorsCount: info?.points_count ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Qdrant connection failed.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { text, limit } = await req.json();
    const queryText = String(text || '').trim();

    if (!queryText) {
      return NextResponse.json(
        { ok: false, error: 'text is required' },
        { status: 400 }
      );
    }

    const vector = await getEmbedding(queryText);
    if (!vector.length) {
      return NextResponse.json({ ok: true, searchResult: [] });
    }

    const client = getQdrantClient();
    const top = Number.isFinite(Number(limit)) ? Math.min(Number(limit), 20) : 8;

    const searchResult = await client.search(QDRANT_COLLECTION, {
      vector,
      limit: top,
      with_payload: true,
      with_vector: false,
    });

    return NextResponse.json({ ok: true, searchResult });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Vector search failed.' },
      { status: 500 }
    );
  }
}

