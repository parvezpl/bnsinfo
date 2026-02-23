'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ReplyForm({ postId }) {
  const { data: session } = useSession();
  
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

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

  return (
    <form className="forums-form-card" onSubmit={handleSubmit}>
      <label className="forums-label">
        जवाब
        <textarea
          rows="4"
          placeholder="अपना जवाब लिखें..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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
