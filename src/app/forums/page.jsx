import "./style.css";
import AdminDeleteButton from "./admin-delete-button";
import PostInteractions from "./post-interactions";
import AdSlot from "../../components/ads/AdSlot";

export const metadata = {
  title: "Forums • BNS Info",
  description: "Community discussions and questions on Bharatiya Nyaya Sanhita 2023.",
  alternates: {
    canonical: "/forums",
  },
  openGraph: {
    title: "Forums • BNS Info",
    description: "Community discussions and questions on Bharatiya Nyaya Sanhita 2023.",
    url: "/forums",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ForumsPage({ searchParams }) {
  const forumsSlot = process.env.NEXT_PUBLIC_ADSENSE_FORUMS_SLOT || "";
  const params = await searchParams;
  const user = (params?.user || "").toString();
  const q = (params?.q || "").toString().trim();
  const category = (params?.category || "").toString().trim();
  const tag = (params?.tag || "").toString().trim();
  const apiBase = String(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  const myPostsHref = user
    ? `/forums/mine?user=${encodeURIComponent(user)}`
    : "/forums/mine";
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (category) qs.set("category", category);
  if (tag) qs.set("tag", tag);
  const postsUrl = `${apiBase}/api/forums/posts${qs.toString() ? `?${qs.toString()}` : ""}`;

  const [catRes, postRes] = await Promise.all([
    fetch(`${apiBase}/api/forums/categories`, { next: { revalidate: 30 } }),
    fetch(postsUrl, { next: { revalidate: 30 } }),
  ]);
  const catsJson = await catRes.json();
  const postsJson = await postRes.json();
  const categories = catsJson?.categories || [];
  const posts = postsJson?.posts || [];
  const popularTags = Array.from(
    new Set(
      posts
        .map((p) => String(p?.tag || "").trim().replace(/^#+/, ""))
        .filter(Boolean)
    )
  ).slice(0, 12);

  const buildTagHref = (selectedTag) => {
    const tagText = String(selectedTag || "").trim().replace(/^#+/, "");
    const tagQs = new URLSearchParams();
    if (user) tagQs.set("user", user);
    if (q) tagQs.set("q", q);
    if (category) tagQs.set("category", category);
    if (tagText) tagQs.set("tag", tagText);
    return `/forums${tagQs.toString() ? `?${tagQs.toString()}` : ""}`;
  };

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
            <a className="forums-btn-ghost" href={myPostsHref}
            >मेरी पोस्ट</a>
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

      <section className="forums-filter">
        <form className="forums-filter-form" method="GET" action="/forums">
          {user ? <input type="hidden" name="user" value={user} /> : null}
          <input
            type="text"
            name="q"
            placeholder="Search title, content, tag..."
            defaultValue={q}
            className="forums-filter-input"
          />
          <select name="category" defaultValue={category} className="forums-filter-select">
            <option value="">All categories</option>
            <option value="general">सामान्य प्रश्न</option>
            <option value="sections">धाराओं का विश्लेषण</option>
            <option value="updates">अपडेट्स और बदलाव</option>
            <option value="cyber">साइबर अपराध</option>
          </select>
          <input
            type="text"
            name="tag"
            placeholder="Tag (e.g. धारा)"
            defaultValue={tag}
            className="forums-filter-input"
          />
          <button type="submit" className="forums-btn-primary">Filter</button>
          <a className="forums-btn-ghost" href="/forums">Reset</a>
        </form>
      </section>
      <section className="forums-ad-section">
        <AdSlot
          slot={forumsSlot}
          className="forums-ad-box"
          label="Sponsored"
          format="autorelaxed"
        />
      </section>
      {popularTags.length > 0 && (
        <section className="forums-tags">
          <div className="forums-tags-head"># Tags</div>
          <div className="forums-tags-list">
            {popularTags.map((t) => {
              const normalized = String(t).replace(/^#+/, "");
              const active = normalized.toLowerCase() === tag.replace(/^#+/, "").toLowerCase();
              return (
                <a
                  key={normalized}
                  href={buildTagHref(normalized)}
                  className={`forums-tag-chip ${active ? "is-active" : ""}`}
                >
                  #{normalized}
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="forums-latest">
        <div className="forums-latest-head">
          <h2>Latest चर्चाएँ</h2>
          <span className="forums-meta">{posts.length} results</span>
        </div>
        <div className="forums-posts">
          {posts.map((p) => (
            <article className="forums-post" key={p.id || p.title}>
              <div className="forums-post-tag">{p.tag}</div>
              <a className="forums-post-title" href={`/forums/${p.id}`}>{p.title}</a>
              {p.content ? (
                <div className="forums-post-content-preview">{p.content}</div>
              ) : null}
              <div className="forums-post-meta">
                <span className="forums-post-author">
                  {p.authorImage ? (
                    <img
                      src={p.authorImage}
                      alt={p.author || "User"}
                      className="forums-post-avatar"
                    />
                  ) : null}
                  by {p.author}
                </span>
                <span>• {p.replies} replies</span>
                <span>• {p.time}</span>
              </div>
              <div className="forums-post-stats">
                <PostInteractions
                  postId={p.id}
                  initialLikes={p.likes ?? 0}
                  initialDislikes={p.dislikes ?? 0}
                />
                <span>💬 {p.comments ?? 0}</span>
                <span>↩ {p.replies ?? 0}</span>
              </div>
              <AdminDeleteButton
                endpoint={`/api/forums/posts/${p.id}`}
                label="Delete Post"
                confirmText="Delete this post and all related replies?"
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
