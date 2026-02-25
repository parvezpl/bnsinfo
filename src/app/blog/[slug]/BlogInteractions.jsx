'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import styles from './interactions.module.css';

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function BlogInteractions({ blogId }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [data, setData] = useState({
    likes: 0,
    dislikes: 0,
    commentsCount: 0,
    userReaction: null,
    comments: [],
  });

  async function refreshData() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/blog/${blogId}/interactions`, { cache: 'no-store' });
      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || 'Failed to load interactions.');
      }
      setData({
        likes: payload.likes || 0,
        dislikes: payload.dislikes || 0,
        commentsCount: payload.commentsCount || 0,
        userReaction: payload.userReaction || null,
        comments: payload.comments || [],
      });
    } catch (err) {
      setError(err?.message || 'Failed to load interactions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!blogId) return;
    refreshData();
  }, [blogId, status]);

  async function postAction(action, text = '') {
    if (status === 'loading') {
      setError('Please wait, checking login status...');
      return;
    }

    if (status !== 'authenticated') {
      signIn('google');
      return;
    }

    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/blog/${blogId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text: String(text || '').trim() }),
      });
      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || 'Action failed.');
      }
      setData({
        likes: payload.likes || 0,
        dislikes: payload.dislikes || 0,
        commentsCount: payload.commentsCount || 0,
        userReaction: payload.userReaction || null,
        comments: payload.comments || [],
      });
      if (action === 'comment') setCommentText('');
    } catch (err) {
      setError(err?.message || 'Action failed.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => postAction('like')}
          disabled={sending || loading}
          className={`${styles.actionBtn} ${data.userReaction === 'like' ? styles.activeLike : ''}`}
        >
          👍 Like ({data.likes})
        </button>
        <button
          type="button"
          onClick={() => postAction('dislike')}
          disabled={sending || loading}
          className={`${styles.actionBtn} ${data.userReaction === 'dislike' ? styles.activeDislike : ''}`}
        >
          👎 Dislike ({data.dislikes})
        </button>
      </div>

      <div className={styles.commentBox}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={styles.textarea}
          placeholder={
            status === 'authenticated'
              ? 'Write your comment...'
              : 'Login to write a comment...'
          }
          maxLength={1000}
        />
        <div className={styles.commentRow}>
          <span className={styles.limit}>{commentText.length}/1000</span>
          <button
            type="button"
            onClick={() => postAction('comment', commentText)}
            disabled={sending || !commentText.trim()}
            className={styles.submitBtn}
          >
            {sending ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.comments}>
        <h3 className={styles.commentsTitle}>Comments ({data.commentsCount})</h3>
        {loading ? (
          <p className={styles.empty}>Loading...</p>
        ) : data.comments.length ? (
          data.comments.map((item) => (
            <article key={item.id} className={styles.comment}>
              <div className={styles.commentHead}>
                <div className={styles.user}>
                  {item.userImage ? (
                    <img src={item.userImage} alt={item.userName} className={styles.avatar} />
                  ) : (
                    <span className={styles.avatarPlaceholder}>{item.userName?.[0] || 'U'}</span>
                  )}
                  <span className={styles.name}>{item.userName}</span>
                </div>
                <time className={styles.time}>{formatDate(item.createdAt)}</time>
              </div>
              <p className={styles.text}>{item.text}</p>
            </article>
          ))
        ) : (
          <p className={styles.empty}>No comments yet.</p>
        )}
      </div>
    </section>
  );
}
