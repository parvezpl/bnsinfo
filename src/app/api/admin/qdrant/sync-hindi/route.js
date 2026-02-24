import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/db';
import Sectionhindi from '../../../../../../lib/schema/bns/hindisections';
import Bnshindis from '../../../../../../lib/schema/bnshi';
import { EMBEDDING_MODEL, getEmbedding } from '@/lib/embedding';
import { getQdrantClient, QDRANT_COLLECTION } from '@/lib/qdrant';

export const runtime = 'nodejs';

function normalizeSection(section) {
  return String(section || '').trim();
}

function buildPointId(section) {
  const normalized = normalizeSection(section);
  const numeric = Number.parseInt(normalized, 10);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }

  // Qdrant point ids should be uint64 or UUID-like strings.
  // Use a deterministic positive int hash for non-numeric sections.
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0) || Date.now();
}

async function ensureCollection(client, vectorSize) {
  let getCollectionError = null;
  try {
    const info = await client.getCollection(QDRANT_COLLECTION);
    const currentSize =
      info?.config?.params?.vectors?.size ??
      info?.result?.config?.params?.vectors?.size ??
      null;

    if (Number.isFinite(currentSize) && Number(currentSize) !== Number(vectorSize)) {
      throw new Error(
        `Qdrant collection vector size mismatch. Collection=${currentSize}, embedding=${vectorSize}.`
      );
    }
    return info;
  } catch (error) {
    getCollectionError = error;
  }

  try {
    await client.createCollection(QDRANT_COLLECTION, {
      vectors: {
        size: vectorSize,
        distance: 'Cosine',
      },
    });
  } catch (createError) {
    const message = String(createError?.message || '').toLowerCase();
    const alreadyExists =
      message.includes('already exists') || message.includes('409');

    if (!alreadyExists) {
      throw createError;
    }
  }

  try {
    const info = await client.getCollection(QDRANT_COLLECTION);
    const currentSize =
      info?.config?.params?.vectors?.size ??
      info?.result?.config?.params?.vectors?.size ??
      null;
    if (Number.isFinite(currentSize) && Number(currentSize) !== Number(vectorSize)) {
      throw new Error(
        `Qdrant collection vector size mismatch. Collection=${currentSize}, embedding=${vectorSize}.`
      );
    }
    return info;
  } catch (finalError) {
    throw (
      getCollectionError ||
      finalError ||
      new Error('Unable to ensure Qdrant collection.')
    );
  }
}

async function getHindiSectionDocs() {
  const flatSections = await Sectionhindi.find(
    {},
    { section: 1, section_content: 1, sub_section_content: 1 }
  )
    .lean()
    .exec();

  if (flatSections.length) {
    return flatSections.map((item) => ({
      section: normalizeSection(item.section),
      section_content: String(
        item.section_content || item.sub_section_content || ''
      ).trim(),
      source: 'Sectionhindi',
    }));
  }

  const chapterDocs = await Bnshindis.find({}, { sections: 1 }).lean().exec();
  return chapterDocs.flatMap((chapter) =>
    (chapter.sections || []).map((item) => ({
      section: normalizeSection(item.section),
      section_content: String(item.section_title || '').trim(),
      source: 'Bnshindis.sections',
    }))
  );
}

async function getEmbeddingStrict(text) {
  const vector = await getEmbedding(text);
  if (!Array.isArray(vector) || !vector.length) {
    throw new Error('Embedding generation failed.');
  }
  return vector;
}

export async function GET() {
  try {
    await connectDB();
    const mongoCount = await Sectionhindi.countDocuments();
    const client = getQdrantClient();
    let collectionInfo = null;
    let collectionExists = true;

    try {
      collectionInfo = await client.getCollection(QDRANT_COLLECTION);
    } catch {
      collectionExists = false;
    }

    return NextResponse.json({
      ok: true,
      collection: QDRANT_COLLECTION,
      mongoHindiSections: mongoCount,
      qdrantCollectionExists: collectionExists,
      qdrantPoints:
        collectionInfo?.points_count ??
        collectionInfo?.indexed_vectors_count ??
        null,
      qdrantStatus: collectionExists ? collectionInfo?.status || null : 'missing',
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Status check failed.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  let stage = 'init';
  try {
    stage = 'db_connect';
    await connectDB();
    stage = 'parse_body';
    const body = await req.json().catch(() => ({}));
    const limit = Math.max(0, Number(body?.limit || 0));
    const offset = Math.max(0, Number(body?.offset || 0));
    const batchSize = Math.min(100, Math.max(1, Number(body?.batchSize || 20)));
    const recreateCollection = Boolean(body?.recreateCollection);

    stage = 'mongo_read';
    const allDocs = await getHindiSectionDocs();
    const validDocs = allDocs.filter(
      (item) => item.section && item.section_content
    );
    const sliced = (limit ? validDocs.slice(offset, offset + limit) : validDocs.slice(offset));
    const deduped = Array.from(
      new Map(sliced.map((doc) => [buildPointId(doc.section), doc])).values()
    );

    if (!deduped.length) {
      return NextResponse.json({
        ok: true,
        processed: 0,
        skipped: validDocs.length - deduped.length,
        totalAvailable: validDocs.length,
        message: 'No documents available for sync.',
      });
    }

    stage = 'embedding_first';
    const client = getQdrantClient();
    const firstVector = await getEmbeddingStrict(deduped[0].section_content);
    if (!firstVector.length) {
      return NextResponse.json(
        { ok: false, error: 'Failed to generate embedding for first section.' },
        { status: 500 }
      );
    }
    if (recreateCollection) {
      stage = 'collection_recreate';
      try {
        await client.deleteCollection(QDRANT_COLLECTION);
      } catch (error) {
        const message = String(error?.message || '').toLowerCase();
        const notFound =
          message.includes('not found') ||
          message.includes("doesn't exist") ||
          message.includes('does not exist') ||
          message.includes('404');
        if (!notFound) throw error;
      }
    }
    stage = 'collection_check';
    await ensureCollection(client, firstVector.length);

    let processed = 0;
    let skipped = 0;

    for (let i = 0; i < deduped.length; i += batchSize) {
      const chunk = deduped.slice(i, i + batchSize);

      const points = [];
      for (const doc of chunk) {
        stage = `embedding_doc_${doc.section || 'unknown'}`;
        const vector = await getEmbeddingStrict(doc.section_content);
        if (!vector.length) {
          skipped += 1;
          continue;
        }

        points.push({
          id: buildPointId(doc.section),
          vector,
          payload: {
            section: doc.section,
            section_content: doc.section_content,
            source: doc.source,
            embedding_model: EMBEDDING_MODEL,
            synced_at: new Date().toISOString(),
          },
        });
      }

      if (points.length) {
        stage = 'qdrant_upsert';
        await client.upsert(QDRANT_COLLECTION, {
          wait: true,
          points,
        });
        processed += points.length;
      }
    }

    return NextResponse.json({
      ok: true,
      collection: QDRANT_COLLECTION,
      processed,
      skipped: skipped + (sliced.length - deduped.length),
      totalAvailable: validDocs.length,
      embeddingModel: EMBEDDING_MODEL,
      syncedRange: {
        offset,
        limit: limit || 'all',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Hindi sync failed.',
        stage,
      },
      { status: 500 }
    );
  }
}
