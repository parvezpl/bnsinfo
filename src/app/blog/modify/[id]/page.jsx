'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function BlogModifyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
  });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/blog?search=${encodeURIComponent(String(id))}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Post not found");
        }
        const data = await res.json();
        if (!mounted) return;
        setForm({
          title: data?.title || "",
          excerpt: data?.excerpt || "",
          content: data?.content || "",
          author: data?.author || "",
        });
      } catch (err) {
        if (!mounted) return;
        setMsg(err?.message || "Failed to load post.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const me = String(session?.user?.name || "").trim().toLowerCase();
  const author = String(form.author || "").trim().toLowerCase();
  const isAdmin = session?.user?.role === "admin";
  const canModify = isAdmin || (!!me && !!author && me === author);

  useEffect(() => {
    if (status !== "authenticated") return;
    const loginAuthor = String(session?.user?.name || "").trim();
    if (!loginAuthor) return;
    setForm((prev) => ({ ...prev, author: loginAuthor }));
  }, [status, session?.user?.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canModify) {
      setMsg("Only post author can modify this post.");
      return;
    }

    setSaving(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("id", String(id));
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("author", String(session?.user?.name || form.author || "").trim());

      const res = await fetch("/api/blog", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update post.");
      router.push(`/blog/${id}`);
      router.refresh();
    } catch (err) {
      setMsg(err?.message || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className={styles.page}>Loading...</main>;
  }

  if (status === "unauthenticated") {
    return <main className={styles.page}>Please login to modify post.</main>;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Modify Blog Post</h1>
      {!canModify ? (
        <p className={styles.error}>Only post author can modify this post.</p>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span>Excerpt</span>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span>Content</span>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={10}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span>Author</span>
          <input
            name="author"
            value={form.author}
            className={styles.input}
            readOnly
            required
          />
        </label>

        {msg ? <p className={styles.error}>{msg}</p> : null}

        <div className={styles.actions}>
          <button type="button" className={styles.ghost} onClick={() => router.back()}>
            Back
          </button>
          <button type="submit" className={styles.primary} disabled={saving || !canModify}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
