'use client';

import { useSession } from "next-auth/react";

export default function AdminDeleteButton({
  endpoint,
  label = "Delete",
  confirmText = "Are you sure?",
  method = "DELETE",
  body = null,
  className = "",
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) return null;

  async function onDelete() {
    const ok = window.confirm(confirmText);
    if (!ok) return;

    const res = await fetch(endpoint, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      alert(payload?.error || "Delete failed.");
      return;
    }
    window.location.reload();
  }

  return (
    <button type="button" className={`forums-admin-delete ${className}`} onClick={onDelete}>
      {label}
    </button>
  );
}
