'use client';

import { useState } from "react";
import HashText from "../hash-text";

export default function ReplyOwnerEditor({ reply }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState(reply?.content || "");

  const canEdit = !!reply?.canEdit;

  async function onSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/forums/replies/${reply.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Failed to update reply.");
      }
      setContent(payload?.content || content);
      setEditing(false);
    } catch (err) {
      setError(err?.message || "Failed to update reply.");
    } finally {
      setSaving(false);
    }
  }

  if (!canEdit || !editing) {
    return (
      <div className="forums-post-title">
        <HashText text={content} className="hash-text" />
        {canEdit ? (
          <div className="owner-inline-tools">
            <button
              type="button"
              className="forums-btn-ghost"
              onClick={() => setEditing(true)}
            >
              Edit Reply
            </button>
          </div>
        ) : null}
        {error ? <div className="forums-status">{error}</div> : null}
      </div>
    );
  }

  return (
    <div className="owner-edit-box">
      <textarea
        rows="4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="owner-edit-actions">
        <button
          type="button"
          className="forums-btn-primary"
          onClick={onSave}
          disabled={saving || !content.trim()}
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

