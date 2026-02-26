'use client';

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./blog_home.module.css";

export default function BlogPostActions({ post }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const isAdmin = session?.user?.role === "admin";
  const currentName = String(session?.user?.name || "").trim().toLowerCase();
  const postAuthor = String(post?.author || "").trim().toLowerCase();
  const canModify = !!currentName && !!postAuthor && currentName === postAuthor;
  const canModifyPost = isAdmin || canModify;

  if (!post?._id || (!isAdmin && !canModifyPost)) return null;

  async function handleDelete() {
    const ok = window.confirm("Delete this blog post?");
    if (!ok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog?id=${encodeURIComponent(post._id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Delete failed");
      }
      window.location.reload();
    } catch (err) {
      alert(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.adminActions}>
      {canModifyPost ? (
        <Link href={`/blog/modify/${post._id}`} className={styles.modifyBtn}>
          Modify
        </Link>
      ) : null}
      {isAdmin ? (
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
