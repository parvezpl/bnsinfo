'use client';

import { useState } from "react";
import HashText from "../hash-text";

export default function PostOwnerEditor({ postId, initialPost }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState(() => ({
    title: initialPost?.title || "",
    content: initialPost?.content || "",
    tag: initialPost?.tag || "",
    category: initialPost?.category || "",
  }));

  const canEdit = !!initialPost?.canEdit;

  async function onSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/forums/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Failed to update post.");
      }
      setPost({
        title: payload.title || post.title,
        content: payload.content || "",
        tag: payload.tag || post.tag,
        category: payload.category || post.category,
      });
      setEditing(false);
    } catch (err) {
      setError(err?.message || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  }

  if (!canEdit) {
    return (
      <>
        <div className="forums-post-title">{post.title}</div>
        <p style={{ marginTop: 10 }}>
          <HashText text={post.content || "कोई विवरण उपलब्ध नहीं है।"} className="hash-text" />
        </p>
      </>
    );
  }

  if (!editing) {
    return (
      <>
        <div className="forums-post-title">{post.title}</div>
        <p style={{ marginTop: 10 }}>
          <HashText text={post.content || "कोई विवरण उपलब्ध नहीं है।"} className="hash-text" />
        </p>
        <button
          type="button"
          className="forums-btn-ghost"
          onClick={() => setEditing(true)}
        >
          Edit Post
        </button>
        {error ? <div className="forums-status">{error}</div> : null}
      </>
    );
  }

  return (
    <div className="owner-edit-box">
      <label className="forums-label">
        Title
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost((prev) => ({ ...prev, title: e.target.value }))}
        />
      </label>
      <label className="forums-label">
        Content
        <textarea
          rows="5"
          value={post.content}
          onChange={(e) => setPost((prev) => ({ ...prev, content: e.target.value }))}
        />
      </label>
      <div className="owner-edit-actions">
        <button
          type="button"
          className="forums-btn-primary"
          onClick={onSave}
          disabled={saving || !post.title.trim()}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="forums-btn-ghost"
          onClick={() => setEditing(false)}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
      {error ? <div className="forums-status">{error}</div> : null}
    </div>
  );
}

