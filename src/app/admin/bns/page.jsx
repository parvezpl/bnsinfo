'use client';
import { use, useEffect, useState } from "react";
import styles from "./page.module.css";
import { signIn, signOut, useSession } from 'next-auth/react'

export default function AdminBnsPage() {
  const { data: session, status } = useSession()
  const [form, setForm] = useState({
    section: "",
    section_content: "",
    example_content: "",
  });
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showRowId, setShowRowId] = useState(null);
  const [msg, setMsg] = useState("");
  const [existMsg, setExistMsg] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session, status]);

  const loadItems = async () => {
    try {
      const res = await fetch("/api/bns/add", { cache: "no-store" });
      const data = await res.json();
      setItems(data.data || []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const checkIsSectionExists = async (section) => {
    const exists = items.some((it) => {
      return it.section === section;
    });
    if (exists) {
      return true;
    }
  };
  const handleChange = (e) => {
    if (e.target.name === "section") {
      const value = e.target.value;
      checkIsSectionExists(value).then((exists) => {
        if (exists) {
          setExistMsg("Section already exists.");
        } else {
          setExistMsg("");
        }
      });
    }

    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/bns/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user: user ? { name: user.name, email: user.email, id: user.id } : null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      setMsg("Section saved successfully.");
      setForm({ section: "", section_content: "", example_content: "" });
      await loadItems();
    } catch (err) {
      setMsg(err.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setDraft({
      section: item.section || "",
      section_content: item.section_content || "",
      example_content: item.example_content || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = async (id) => {
    try {
      setSavingId(id);
      setMsg("");
      const res = await fetch(`/api/bns/add?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, user: user ? { name: user.name, email: user.email, id: user.id } : null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update");
      }
      const data = await res.json();
      const updated = data.data;
      setItems((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
      setEditingId(null);
      setDraft({});
    } catch (err) {
      setMsg(err.message || "Failed to update.");
    } finally {
      setSavingId(null);
    }
  };

  const toggleShowRow = (id) => {
    setShowRowId((prev) => (prev === id ? null : id));
  };

  const deleteRow = async (id) => {
    const ok = window.confirm("Delete this section?");
    if (!ok) return;

    try {
      setDeletingId(id);
      setMsg("");
      const res = await fetch(`/api/bns/add?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }

      setItems((prev) => prev.filter((it) => it._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setDraft({});
      }
      if (showRowId === id) {
        setShowRowId(null);
      }
      setMsg("Row deleted successfully.");
    } catch (err) {
      setMsg(err.message || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Add BNS Section (Hindi)</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Section</span>
          <input
            name="section"
            value={form.section}
            onChange={handleChange}
            className={styles.input}
            placeholder="उदाहरण: धारा 1"
            required
          />
        </label>
        {existMsg && <p className={styles.Existmessage}>{existMsg}</p>}

        <label className={styles.field}>
          <span className={styles.label}>Section Content</span>
          <textarea
            name="section_content"
            value={form.section_content}
            onChange={handleChange}
            className={styles.textarea}
            rows={6}
            placeholder="उदाहरण: यह धारा ..."
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Example Content</span>
          <textarea
            name="example_content"
            value={form.example_content}
            onChange={handleChange}
            className={styles.textarea}
            rows={4}
            placeholder="उदाहरण: अगर किसी व्यक्ति ने..."
          />
        </label>

        <button className={styles.button} disabled={loading} type="submit">
          {loading ? "Saving..." : "Save Section"}
        </button>
      </form>

      {msg && <p className={styles.message}>{msg}</p>}

      <div className={styles.list}>
        <h2 className={styles.listTitle}>Saved Sections</h2>
        <div className={styles.searchRow}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved sections..."
            className={styles.search}
          />
        </div>
        {items.length === 0 && <p className={styles.muted}>No sections yet.</p>}
        <ul className={styles.listItems}>
          {items
            .filter((item) => {
              const q = query.trim().toLowerCase();
              if (!q) return true;
              return (
                item.section?.toLowerCase().includes(q) ||
                item.section_content?.toLowerCase().includes(q) ||
                item.example_content?.toLowerCase().includes(q)
              );
            })
            .map((item) => {
              const isEditing = editingId === item._id;
              return (
                <li key={item._id} className={styles.listItem}>
                  {isEditing ? (
                    <div className={styles.editGrid}>
                      <input
                        className={styles.inlineInput}
                        value={draft.section}
                        onChange={(e) => updateDraft("section", e.target.value)}
                      />
                      <textarea
                        className={styles.inlineTextarea}
                        rows={4}
                        value={draft.section_content}
                        onChange={(e) => updateDraft("section_content", e.target.value)}
                      />
                      <textarea
                        className={styles.inlineTextarea}
                        rows={3}
                        value={draft.example_content}
                        onChange={(e) => updateDraft("example_content", e.target.value)}
                      />
                      <div className={styles.actions}>
                        <button
                          className={styles.actionPrimary}
                          onClick={() => saveEdit(item._id)}
                          disabled={savingId === item._id}
                        >
                          {savingId === item._id ? "Saving..." : "Update"}
                        </button>
                        <button className={styles.actionGhost} onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.itemHead}>{item.section}</div>
                      <div className={styles.itemBody}>{item.section_content}</div>
                      {item.example_content ?
                        <div className={styles.itemExample}>{item.example_content}</div>
                        : null
                      }
                      <div className={styles.actions}>
                        <button className={styles.actionGhost} onClick={() => startEdit(item)}>Edit</button>
                        <button className={styles.actionGhost} onClick={() => toggleShowRow(item._id)}>
                          {showRowId === item._id ? "Hide Row Data" : "Show Row Data"}
                        </button>
                        <button
                          className={styles.actionDanger}
                          onClick={() => deleteRow(item._id)}
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      {showRowId === item._id ? (
                        <pre className={styles.rowData}>{JSON.stringify(item, null, 2)}</pre>
                      ) : null}
                    </>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </main>
  );
}
