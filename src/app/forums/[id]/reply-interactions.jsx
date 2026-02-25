'use client';

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import HashText from "../hash-text";

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

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "";
  }
}

export default function ReplyInteractions({ replyId }) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [hashState, setHashState] = useState({ open: false, start: 0, end: 0, query: "" });
  const [data, setData] = useState({
    likes: 0,
    dislikes: 0,
    commentsCount: 0,
    userReaction: null,
    comments: [],
  });

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/forums/replies/${replyId}/interactions`, { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || "Failed to load reply interactions.");
      }
      setData({
        likes: payload.likes || 0,
        dislikes: payload.dislikes || 0,
        commentsCount: payload.commentsCount || 0,
        userReaction: payload.userReaction || null,
        comments: payload.comments || [],
      });
    } catch (err) {
      setError(err?.message || "Failed to load reply interactions.");
    } finally {
      setLoading(false);
    }
  }

  function handleCommentChange(e) {
    const nextValue = e.target.value;
    const caret = e.target.selectionStart ?? nextValue.length;
    setCommentText(nextValue);
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
    const before = commentText.slice(0, hashState.start);
    const after = commentText.slice(hashState.end);
    const needsSpace = after && !after.startsWith(" ");
    const next = `${before}${insert}${needsSpace ? " " : ""}${after}`;
    setCommentText(next);
    setHashState({ open: false, start: 0, end: 0, query: "" });
  }

  const suggestions = hashState.open ? getHashSuggestions(hashState.query) : [];

  useEffect(() => {
    if (!replyId) return;
    fetchData();
  }, [replyId, status]);

  async function postAction(action, text = "", commentId = "") {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/forums/replies/${replyId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text: String(text || "").trim(),
          commentId: String(commentId || "").trim(),
        }),
      });
      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || "Action failed.");
      }
      setData({
        likes: payload.likes || 0,
        dislikes: payload.dislikes || 0,
        commentsCount: payload.commentsCount || 0,
        userReaction: payload.userReaction || null,
        comments: payload.comments || [],
      });
      if (action === "comment") setCommentText("");
    } catch (err) {
      setError(err?.message || "Action failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="reply-interactions">
      <div className="reply-actions">
        <button
          type="button"
          className={`reply-action-btn ${data.userReaction === "like" ? "active-like" : ""}`}
          onClick={() => postAction("like")}
          disabled={sending || loading}
        >
          👍 {data.likes}
        </button>
        <button
          type="button"
          className={`reply-action-btn ${data.userReaction === "dislike" ? "active-dislike" : ""}`}
          onClick={() => postAction("dislike")}
          disabled={sending || loading}
        >
          👎 {data.dislikes}
        </button>
        <span className="reply-comment-count">💬 {data.commentsCount}</span>
      </div>

      <div className="reply-comment-box">
        <textarea
          rows="2"
          value={commentText}
          onChange={handleCommentChange}
          placeholder={status === "authenticated" ? "Reply comment..." : "Login to comment..."}
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
        <button
          type="button"
          className="forums-btn-ghost"
          onClick={() => postAction("comment", commentText)}
          disabled={sending || !commentText.trim()}
        >
          {sending ? "Posting..." : "Comment"}
        </button>
      </div>

      {error && <div className="forums-status">{error}</div>}

      <div className="reply-comments-list">
        {data.comments.map((c) => (
          <article className="reply-comment" key={c.id}>
            <div className="reply-comment-head">
              <span>{c.userName}</span>
              <div className="reply-comment-tools">
                <span>{formatDate(c.createdAt)}</span>
                {isAdmin && (
                  <button
                    type="button"
                    className="forums-admin-delete"
                    onClick={() => postAction("deleteComment", "", c.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="reply-comment-text">
              <HashText text={c.text} className="hash-text" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
