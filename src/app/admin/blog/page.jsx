'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function BlogAdminForm() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    author: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('excerpt', form.excerpt);
      formData.append('author', form.author);
      formData.append('image', form.image);
      const userlogo = session?.user.image;
      if (userlogo) {
        formData.append('authorlogo', userlogo);
      }
      const res = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });
      const getback = await res.json();

      console.log('Form data submitted:', getback);
      if (res.ok) {
        setMsg('Blog uploaded successfully!');
        setForm({ title: '', excerpt: '', author: '', image: null });
        setImagePreview(null);
      } else {
        const error = await res.json();
        setMsg('Failed: ' + error.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error:', err);
      setMsg('Error submitting blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Create Blog</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Excerpt</span>
          <input
            name="excerpt"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Author</span>
          <input
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <div className={styles.uploadRow}>
          <label className={styles.field}>
            <span className={styles.label}>Image</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className={styles.preview}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Submitting...' : 'Submit Blog'}
        </button>
      </form>

      {msg && <p className={styles.message}>{msg}</p>}
    </main>
  );
}
