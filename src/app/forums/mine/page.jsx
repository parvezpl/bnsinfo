import "../style.css";

export const metadata = {
  title: "My Posts • BNS Info",
  description: "Your forum posts on BNS Info.",
};

export default async function MyPostsPage({ searchParams }) {
  const author = (searchParams?.author || "").toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/forums/posts${author ? `?author=${encodeURIComponent(author)}` : ""}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  const posts = data?.posts || [];

  return (
    <main className="forums-page">
      <section className="forums-hero">
        <div className="forums-hero-inner">
          <div className="forums-badge">My Posts</div>
          <h1>मेरी पोस्ट</h1>
          <p>यहां आपकी सभी पोस्ट दिखाई जाएंगी।</p>
        </div>
      </section>

      <section className="forums-form">
        <form className="forums-form-card" method="GET">
          <label className="forums-label">
            आपका नाम
            <input type="text" name="author" placeholder="जैसे: Rohit" defaultValue={author} />
          </label>
          <div className="forums-form-actions">
            <button type="submit" className="forums-btn-primary">फिल्टर करें</button>
          </div>
        </form>
      </section>

      <section className="forums-latest">
        <div className="forums-latest-head">
          <h2>हाल की पोस्ट</h2>
          <a className="forums-btn-primary" href="/forums/new">नया पोस्ट</a>
        </div>
        <div className="forums-posts">
          {posts.length === 0 && (
            <article className="forums-post">कोई पोस्ट नहीं मिली।</article>
          )}
          {posts.map((p) => (
            <article className="forums-post" key={p.id || p.title}>
              <div className="forums-post-tag">{p.tag}</div>
              <div className="forums-post-title">{p.title}</div>
              <div className="forums-post-meta">
                <span>by {p.author}</span>
                <span>• {p.replies} replies</span>
                <span>• {p.time}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
