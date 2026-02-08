import "./style.css";

export const metadata = {
  title: "Forums • BNS Info",
  description: "Community discussions and questions on Bharatiya Nyaya Sanhita 2023.",
};

export default async function ForumsPage() {
  const [catRes, postRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/forums/categories`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/forums/posts`, { cache: "no-store" }),
  ]);
  const catsJson = await catRes.json();
  const postsJson = await postRes.json();
  const categories = catsJson?.categories || [];
  const posts = postsJson?.posts || [];

  return (
    <main className="forums-page">
      <section className="forums-hero">
        <div className="forums-hero-inner">
          <div className="forums-badge">Community</div>
          <h1>Forums</h1>
          <p>
            चर्चा करें, प्रश्न पूछें, और BNS 2023 को बेहतर समझने में एक-दूसरे की
            मदद करें।
          </p>
          <div className="forums-actions">
            <a className="forums-btn-primary" href="/forums/new">नया विषय</a>
            <a className="forums-btn-ghost" href="/forums/mine">मेरी पोस्ट</a>
          </div>
        </div>
      </section>

      <section className="forums-grid">
        {categories.map((c) => (
          <article className="forums-card" key={c.id || c.title}>
            <div className="forums-card-title">{c.title}</div>
            <p>{c.desc}</p>
            <span className="forums-meta">{c.count} चर्चाएँ</span>
          </article>
        ))}
      </section>

      <section className="forums-latest">
        <div className="forums-latest-head">
          <h2>Latest चर्चाएँ</h2>
          <button className="forums-btn-ghost" type="button">सभी देखें</button>
        </div>
        <div className="forums-posts">
          {posts.map((p) => (
            <article className="forums-post" key={p.id || p.title}>
              <div className="forums-post-tag">{p.tag}</div>
              <a className="forums-post-title" href={`/forums/${p.id}`}>{p.title}</a>
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
