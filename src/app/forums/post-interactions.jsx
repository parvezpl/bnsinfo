'use client';

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function PostInteractions({
  postId,
  initialLikes = 0,
  initialDislikes = 0,
}) {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    likes: Number(initialLikes) || 0,
    dislikes: Number(initialDislikes) || 0,
    userReaction: null,
  });

  async function fetchData() {
    if (!postId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/forums/posts/${postId}/interactions`, { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || "Failed to load post reactions.");
      }
      setData({
        likes: payload.likes || 0,
        dislikes: payload.dislikes || 0,
        userReaction: payload.userReaction || null,
      });
    } catch (err) {
      setError(err?.message || "Failed to load post reactions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [postId, status]);

  async function postAction(action) {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/forums/posts/${postId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || "Action failed.");
      }
      setData({
        likes: payload.likes || 0,
        dislikes: payload.dislikes || 0,
        userReaction: payload.userReaction || null,
      });
    } catch (err) {
      setError(err?.message || "Action failed.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`forums-stat-action ${data.userReaction === "like" ? "active-like" : ""}`}
        onClick={() => postAction("like")}
        disabled={sending || loading}
        aria-label="Like this post"
      >
        👍 {data.likes}
      </button>
      <button
        type="button"
        className={`forums-stat-action ${data.userReaction === "dislike" ? "active-dislike" : ""}`}
        onClick={() => postAction("dislike")}
        disabled={sending || loading}
        aria-label="Dislike this post"
      >
        👎 {data.dislikes}
      </button>
      {error ? <span className="forums-stat-error">{error}</span> : null}
    </>
  );
}
