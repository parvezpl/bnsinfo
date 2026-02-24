'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function AdminQdrantPage() {
  const [limit, setLimit] = useState('');
  const [offset, setOffset] = useState('0');
  const [batchSize, setBatchSize] = useState('20');
  const [recreateCollection, setRecreateCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkStatus = async () => {
    setStatusLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/qdrant/sync-hindi', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || 'Status check failed.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Status check failed.');
    } finally {
      setStatusLoading(false);
    }
  };

  const syncNow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        offset: Number(offset || 0),
        batchSize: Number(batchSize || 20),
        recreateCollection,
      };
      if (String(limit).trim()) payload.limit = Number(limit);

      const res = await fetch('/api/admin/qdrant/sync-hindi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        setResult(data);
        const stageText = data?.stage ? ` (stage: ${data.stage})` : '';
        throw new Error((data?.error || 'Sync failed.') + stageText);
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Hindi Sections to Qdrant</h1>
      <p className={styles.sub}>
        Manually embed Hindi section data from MongoDB and upsert vectors into
        Qdrant for semantic search.
      </p>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={checkStatus}
          disabled={statusLoading}
        >
          {statusLoading ? 'Checking...' : 'Check Connection Status'}
        </button>
      </div>

      <form className={styles.form} onSubmit={syncNow}>
        <label className={styles.field}>
          <span>Limit (optional)</span>
          <input
            className={styles.input}
            type="number"
            min="0"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="blank = all"
          />
        </label>

        <label className={styles.field}>
          <span>Offset</span>
          <input
            className={styles.input}
            type="number"
            min="0"
            value={offset}
            onChange={(e) => setOffset(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Batch Size</span>
          <input
            className={styles.input}
            type="number"
            min="1"
            max="100"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
          />
        </label>

        <button className={styles.primaryBtn} disabled={loading} type="submit">
          {loading ? 'Syncing...' : 'Start Manual Sync'}
        </button>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={recreateCollection}
            onChange={(e) => setRecreateCollection(e.target.checked)}
          />
          <span>Recreate collection before sync</span>
        </label>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultHead}>Response</div>
          <pre className={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
