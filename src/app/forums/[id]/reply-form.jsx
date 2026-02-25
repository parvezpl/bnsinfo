'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const TAG_HINTS = ["धारा", "BNS", "IPC", "cyber", "updates", "forum"];
const SECTION_HINTS = ["23", "34", "144", "302", "304", "376", "420"];

function parseHashQuery(text, caret) {
  const uptoCaret = String(text || "").slice(0, caret);
  const match = uptoCaret.match(/(^|\s)#([A-Za-z0-9_\u0900-\u097F-]*)$/);
  if (!match) return null;
  const hashIndex = uptoCaret.lastIndexOf("#");
  return {
    query: match[2] || "",
    start: hashIndex + 1,
    end: caret,
  };
}

function getHashSuggestions(query) {
  const q = String(query || "").toLowerCase();
  const combined = [...SECTION_HINTS, ...TAG_HINTS];
  const filtered = combined.filter((item) => String(item).toLowerCase().startsWith(q));
  return Array.from(new Set(filtered)).slice(0, 6);
}

export default function ReplyForm({ postId }) {
  const { data: session } = useSession();
  
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [hashState, setHashState] = useState({ open: false, start: 0, end: 0, query: "" });

  const author = session?.user?.name || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setStatus("कृपया नाम और जवाब लिखें।");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/forums/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, author, content }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to add reply");
      }
      setContent("");
      setStatus("जवाब जोड़ दिया गया है।");
      router.refresh();
    } catch (err) {
      setStatus(err.message || "कुछ गलत हो गया।");
    } finally {
      setLoading(false);
    }
  };

  function handleContentChange(e) {
    const nextValue = e.target.value;
    const caret = e.target.selectionStart ?? nextValue.length;
    setContent(nextValue);
    const parsed = parseHashQuery(nextValue, caret);
    if (!parsed) {
      setHashState({ open: false, start: 0, end: 0, query: "" });
      return;
    }
    setHashState({
      open: true,
      start: parsed.start,
      end: parsed.end,
      query: parsed.query,
    });
  }

  function applySuggestion(value) {
    const insert = String(value || "").replace(/^#+/, "");
    if (!insert) return;
    const before = content.slice(0, hashState.start);
    const after = content.slice(hashState.end);
    const needsSpace = after && !after.startsWith(" ");
    const next = `${before}${insert}${needsSpace ? " " : ""}${after}`;
    setContent(next);
    setHashState({ open: false, start: 0, end: 0, query: "" });
  }

  const suggestions = hashState.open ? getHashSuggestions(hashState.query) : [];

  return (
    <form className="forums-form-card" onSubmit={handleSubmit}>
      <div className="forums-form-top">
        <Link href="/forums" className="forums-back-btn">← Back</Link>
      </div>
      <label className="forums-label">
        जवाब
        <textarea
          rows="4"
          placeholder="अपना जवाब लिखें..."
          value={content}
          onChange={handleContentChange}
        />
        {suggestions.length > 0 && (
          <div className="hash-suggest">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="hash-suggest-btn"
                onClick={() => applySuggestion(s)}
              >
                #{s}
              </button>
            ))}
          </div>
        )}
      </label>
      {status && <div className="forums-status">{status}</div>}
      <div className="forums-form-actions">
        <button type="submit" className="forums-btn-primary" disabled={loading}>
          {loading ? "जवाब भेजा जा रहा है..." : "जवाब भेजें"}
        </button>
      </div>
    </form>
  );
}
