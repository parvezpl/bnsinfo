'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

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
      const userlogo = session?.user.image
      if (userlogo) {
        formData.append('authorlogo', userlogo);
      }
      const res = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });
      const getback = await res.json()

      console.log('Form data submitted:', getback);
      if (res.ok) {
        setMsg('✅ Blog uploaded successfully!');
        setForm({ title: '', excerpt: '', author: '', image: null });
        setImagePreview(null);
      } else {
        const error = await res.json();
        setMsg('❌ Failed: ' + error.message || 'Unknown error');
      }

    } catch (err) {
      console.error('Error:', err);
      setMsg('❌ Error submitting blog.');
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
          name="excerpt"
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div className="flex flex-row items-start gap-4">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-auto border rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Submit Blog'}
        </button>
      </form>

      {msg && <p className="mt-4 text-green-700">{msg}</p>}
    </main>
  );
}
