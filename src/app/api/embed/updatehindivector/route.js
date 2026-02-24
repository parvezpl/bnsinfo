import { NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/embedding';
import { getQdrantClient, QDRANT_COLLECTION } from '@/lib/qdrant';

export const runtime = 'nodejs';

function toPointId(section) {
  const parsed = parseInt(String(section || '').trim(), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return Date.now();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const section = body?.section ?? body?.id;
    const payload = body?.payload || {};
    const content = payload?.section_content || body?.content || '';

    if (!section || !String(content).trim()) {
      return NextResponse.json(
        { ok: false, error: 'section and content are required' },
        { status: 400 }
      );
    }

    const vector =
      Array.isArray(body?.vector) && body.vector.length
        ? body.vector
        : await getEmbedding(content);

    if (!Array.isArray(vector) || !vector.length) {
      return NextResponse.json(
        { ok: false, error: 'Unable to create embedding vector' },
        { status: 500 }
      );
    }

    const point = {
      id: toPointId(section),
      vector,
      payload: {
        section: String(section),
        section_content: String(content),
        ...payload,
      },
    };

    const client = getQdrantClient();
    await client.upsert(QDRANT_COLLECTION, {
      wait: true,
      points: [point],
    });

    return NextResponse.json({ ok: true, pointId: point.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Vector update failed.' },
      { status: 500 }
    );
  }
}

