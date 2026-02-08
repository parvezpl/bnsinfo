import "../style.css";
import ReplyForm from "./reply-form";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Thread • ${id}` };
}

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/forums/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getReplies(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/forums/replies?postId=${id}`, { cache: "no-store" });
  if (!res.ok) return { replies: [] };
  return res.json();
}

export default async function ThreadPage({ params }) {
  const { id: postId } = await params;
  const post = await getPost(postId);
  const repliesData = await getReplies(postId);
  const replies = repliesData?.replies || [];

  if (!post) {
    return (
      <main className="forums-page">
        <section className="forums-hero">
          <div className="forums-hero-inner">
            <div className="forums-badge">Thread</div>
            <h1>पोस्ट नहीं मिला</h1>
            <p>यह पोस्ट मौजूद नहीं है या हटाई जा चुकी है।</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="forums-page">
      <section className="forums-hero">
        <div className="forums-hero-inner">
          <div className="forums-badge">{post.tag}</div>
          <h1>{post.title}</h1>
          <p>by {post.author} • {post.time}</p>
        </div>
      </section>

      <section className="forums-latest">
        <div className="forums-latest-head">
          <h2>विवरण</h2>
        </div>
        <div className="forums-posts">
          <article className="forums-post">
            <div className="forums-post-title">{post.title}</div>
            <div className="forums-post-meta">
              <span>by {post.author}</span>
              <span>• {post.replies} replies</span>
            </div>
            <p style={{ marginTop: 10 }}>{post.content || "कोई विवरण उपलब्ध नहीं है।"}</p>
          </article>
        </div>
      </section>

      <section className="forums-latest">
        <div className="forums-latest-head">
          <h2>Replies</h2>
        </div>
        <div className="forums-posts">
          {replies.length === 0 && (
            <div className="forums-post">अभी कोई जवाब नहीं है।</div>
          )}
          {replies.map((r) => (
            <article className="forums-post" key={r.id}>
              <div className="forums-post-title">{r.content}</div>
              <div className="forums-post-meta">
                <span>by {r.author}</span>
                <span>• {new Date(r.time).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="forums-form">
        <ReplyForm postId={postId} />
      </section>
    </main>
  );
}
