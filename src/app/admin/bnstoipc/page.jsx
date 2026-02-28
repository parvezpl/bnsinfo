import { connectDB } from "../../../../lib/db";
import BnsToIpcSearchLog from "../../../../lib/models/BnsToIpcSearchLog";
import styles from "./page.module.css";

function escapeRegex(text = "") {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatDate(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export default async function AdminBnsToIpcPage({ searchParams }) {
  const params = await searchParams;
  const limitRaw = Number(params?.limit);
  const limit = Number.isFinite(limitRaw)
    ? Math.max(1, Math.min(500, Math.floor(limitRaw)))
    : 200;
  const app = String(params?.app || "").trim();
  const source = String(params?.source || "").trim();
  const q = String(params?.q || "").trim();

  const query = {};
  if (app) query.app = app;
  if (source) query.source = source;
  if (q) query.query = { $regex: escapeRegex(q), $options: "i" };

  await connectDB();
  const items = await BnsToIpcSearchLog.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .lean();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>BnsToIpc Search Logs</h1>
      <p className={styles.sub}>
        Android app logs received via API. Use this data for learning and mapping improvements.
      </p>

      <form className={styles.filters} method="get">
        <label className={styles.field}>
          <span>Query contains</span>
          <input className={styles.input} name="q" defaultValue={q} placeholder="search query..." />
        </label>
        <label className={styles.field}>
          <span>App</span>
          <input className={styles.input} name="app" defaultValue={app} placeholder="BnsToIpc" />
        </label>
        <label className={styles.field}>
          <span>Source</span>
          <input className={styles.input} name="source" defaultValue={source} placeholder="home_search" />
        </label>
        <label className={styles.field}>
          <span>Limit</span>
          <input className={styles.input} name="limit" type="number" min="1" max="500" defaultValue={String(limit)} />
        </label>
        <button type="submit" className={styles.btn}>Apply</button>
      </form>

      <p className={styles.count}>Showing {items.length} item(s)</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Received At</th>
              <th>App</th>
              <th>Item ID</th>
              <th>Query</th>
              <th>BNS</th>
              <th>IPC</th>
              <th>isBns</th>
              <th>Source</th>
              <th>Client Created</th>
              <th>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={String(item._id)}>
                <td>{formatDate(item.createdAt)}</td>
                <td>{String(item.app || "-")}</td>
                <td>{String(item.itemId || "-")}</td>
                <td className={styles.textCol}>{String(item.query || "-")}</td>
                <td className={styles.textCol}>{String(item.bns || "-")}</td>
                <td className={styles.textCol}>{String(item.ipc || "-")}</td>
                <td>{item.isBns ? "true" : "false"}</td>
                <td>{String(item.source || "-")}</td>
                <td>{formatDate(item.clientCreatedAt)}</td>
                <td>{formatDate(item.sentAt)}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={10} className={styles.empty}>No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
