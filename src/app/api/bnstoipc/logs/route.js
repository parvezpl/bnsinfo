import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import BnsToIpcSearchLog from "../../../../../lib/models/BnsToIpcSearchLog";

export const runtime = "nodejs";

function escapeRegex(text = "") {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeItem(item, app, sentAt) {
  const query = String(item?.query || "").trim();
  if (!query) return null;

  return {
    app,
    sentAt,
    itemId: String(item?.id || "").trim().slice(0, 200),
    query: query.slice(0, 3000),
    bns: String(item?.bns || "").trim().slice(0, 3000),
    ipc: String(item?.ipc || "").trim().slice(0, 3000),
    isBns: Boolean(item?.isBns),
    source: String(item?.source || "home_search").trim().slice(0, 120),
    clientCreatedAt: parseDate(item?.created_at),
    rawItem: item && typeof item === "object" ? item : {},
  };
}

export async function POST(req) {
  console.log("Received logs POST request", );
  try {
    const body = await req.json().catch(() => ({}));
    const app = String(body?.app || "BnsToIpc").trim().slice(0, 120);
    const sentAt = parseDate(body?.sent_at);
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json(
        { ok: false, error: "items array is required." },
        { status: 400 }
      );
    }

    const normalized = items
      .slice(0, 1000)
      .map((item) => normalizeItem(item, app, sentAt))
      .filter(Boolean);

    if (!normalized.length) {
      return NextResponse.json(
        { ok: false, error: "No valid items found to store." },
        { status: 400 }
      );
    }

    await connectDB();
    const inserted = await BnsToIpcSearchLog.insertMany(normalized, { ordered: false });

    return NextResponse.json({
      ok: true,
      app,
      sent_at: sentAt ? sentAt.toISOString() : null,
      received: items.length,
      stored: inserted.length,
      skipped: items.length - inserted.length,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to store logs." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  console.log("Received logs GET request", );
  try {
    const { searchParams } = new URL(req.url);
    const limitRaw = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitRaw)
      ? Math.max(1, Math.min(500, Math.floor(limitRaw)))
      : 200;
    const app = String(searchParams.get("app") || "").trim();
    const source = String(searchParams.get("source") || "").trim();
    const q = String(searchParams.get("q") || "").trim();

    const query = {};
    if (app) query.app = app;
    if (source) query.source = source;
    if (q) query.query = { $regex: escapeRegex(q), $options: "i" };

    await connectDB();
    const items = await BnsToIpcSearchLog.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      ok: true,
      count: items.length,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to fetch logs." },
      { status: 500 }
    );
  }
}
