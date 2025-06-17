// app/admin/blog/page.jsx
"use client";
import { useState } from "react";

export default function BlogAdminForm() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg("✅ Blog uploaded successfully!");
        setForm({ title: "", slug: "", summary: "", content: "" });
      } else {
        const error = await res.json();
        setMsg("❌ Failed: " + error.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error:", err);
      setMsg("❌ Error submitting blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📄 Create Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="slug"
          placeholder="Slug (e.g., bns-ai-update)"
          value={form.slug}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="summary"
          placeholder="Summary"
          value={form.summary}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="content"
          placeholder="Content (HTML or plain text)"
          value={form.content}
          onChange={handleChange}
          required
          rows={10}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>

      {msg && <p className="mt-4 text-green-700">{msg}</p>}
    </main>
  );
}
