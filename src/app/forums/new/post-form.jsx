'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CreatePostForm() {

  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [tag, setTag] = useState("धारा");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [smg, setSmg] = useState("");

  // ✅ derived author (no state needed)
  const author = session?.user?.name || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      setSmg("कृपया शीर्षक और नाम भरें।");
      return;
    }

    try {
      setLoading(true);
      setSmg("");

      const res = await fetch("/api/forums/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          tag,
          category,
          content,
          user: session?.user || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create post");
      }

      setSmg("पोस्ट सफलतापूर्वक बना दी गई है।");

      // reset form
      setTitle("");
      setTag("धारा");
      setCategory("general");
      setContent("");

    } catch (err) {
      setSmg(err.message || "कुछ गलत हो गया।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forums-form">
      <form className="forums-form-card" onSubmit={handleSubmit}>

        <label className="forums-label">
          आपका नाम
          <p style={{ paddingLeft: "30px" }}>
            {author || "(आप लॉगिन नहीं हैं)"}
          </p>
        </label>

        <label className="forums-label">
          शीर्षक
          <input
            type="text"
            placeholder="जैसे: धारा 144 का वास्तविक प्रभाव?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="forums-label">
          श्रेणी
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="general">सामान्य प्रश्न</option>
            <option value="sections">धाराओं का विश्लेषण</option>
            <option value="updates">अपडेट्स और बदलाव</option>
            <option value="cyber">साइबर अपराध</option>
          </select>
        </label>

        <label className="forums-label">
          टैग
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </label>

        <label className="forums-label">
          विवरण
          <textarea
            rows="6"
            placeholder="अपना प्रश्न/चर्चा विस्तार से लिखें..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        {smg && <div className="forums-status">{smg}</div>}

        <div className="forums-form-actions">
          <button
            type="button"
            className="forums-btn-ghost"
            onClick={() => {
              setTitle("");
              setTag("धारा");
              setCategory("general");
              setContent("");
              setSmg("");
            }}
          >
            रद्द करें
          </button>

          <button type="submit" className="forums-btn-primary" disabled={loading}>
            {loading ? "पोस्ट हो रही है..." : "पोस्ट करें"}
          </button>
        </div>

      </form>
    </section>
  );
}