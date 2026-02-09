"use client";
import { useEffect, useState } from "react";
import styles from "./userstable.module.css";

export function UsersTable({ users }) {
    const [query, setQuery] = useState("");
    const [localUsers, setLocalUsers] = useState(users || []);
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setLocalUsers(users || []);
    }, [users]);

    const filteredUsers = localUsers.filter(
        (user) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase()) ||
            user.role?.toLowerCase().includes(query.toLowerCase())
    );

    const startEdit = (user) => {
        setEditingId(user._id);
        setDraft({
            name: user.name || "",
            role: user.role || "user",
            status: user.status || "active",
            isPaid: !!user.isPaid,
        });
        setError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setDraft({});
        setError("");
    };

    const updateDraft = (key, value) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    const saveUser = async (userId) => {
        try {
            setSavingId(userId);
            setError("");
            const res = await fetch(`/api/users/users?id=${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Update failed");
            }
            const updated = await res.json();
            setLocalUsers((prev) =>
                prev.map((u) => (u._id === updated._id ? updated : u))
            );
            setEditingId(null);
        } catch (err) {
            setError(err.message || "Update failed");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.search}
                />
                {error && <div className={styles.error}>{error}</div>}
            </div>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Plan</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, i) => {
                            const isEditing = editingId === user._id;
                            return (
                                <tr key={user._id || i}>
                                    <td className={styles.cellStrong}>
                                        {isEditing ? (
                                            <input
                                                className={styles.inlineInput}
                                                value={draft.name}
                                                onChange={(e) => updateDraft("name", e.target.value)}
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td>{user.email}</td>
                                    <td className={styles.capitalize}>
                                        {isEditing ? (
                                            <select
                                                className={styles.inlineSelect}
                                                value={draft.role}
                                                onChange={(e) => updateDraft("role", e.target.value)}
                                            >
                                                <option value="user">user</option>
                                                <option value="author">author</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <select
                                                className={styles.inlineSelect}
                                                value={draft.status}
                                                onChange={(e) => updateDraft("status", e.target.value)}
                                            >
                                                <option value="active">active</option>
                                                <option value="blocked">blocked</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`${styles.badge} ${user.status === "blocked" ? styles.badgeBlocked : styles.badgeActive}`}
                                            >
                                                {user.status || "active"}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <select
                                                className={styles.inlineSelect}
                                                value={draft.isPaid ? "paid" : "free"}
                                                onChange={(e) => updateDraft("isPaid", e.target.value === "paid")}
                                            >
                                                <option value="free">free</option>
                                                <option value="paid">paid</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`${styles.badge} ${user.isPaid ? styles.badgePaid : styles.badgeFree}`}
                                            >
                                                {user.isPaid ? "Paid" : "Free"}
                                            </span>
                                        )}
                                    </td>
                                    <td className={styles.muted}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.actionPrimary}
                                                    onClick={() => saveUser(user._id)}
                                                    disabled={savingId === user._id}
                                                >
                                                    {savingId === user._id ? "Saving..." : "Save"}
                                                </button>
                                                <button className={styles.actionGhost} onClick={cancelEdit}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button className={styles.actionGhost} onClick={() => startEdit(user)}>
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={7} className={styles.empty}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
