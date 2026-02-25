import "../style.css";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import ForumPost from "../../../../lib/models/ForumPost";
import ForumReply from "../../../../lib/models/ForumReply";
import Link from "next/link";
import AdminDeleteButton from "../admin-delete-button";

export const metadata = {
  title: "My Posts • BNS Info",
  description: "Your forum posts on BNS Info.",
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function MyPostsPage() {
  const session = await getAuthSession();
  if (!session?.user?.name) {
    redirect("/login");
  }

  const myName = String(session?.user?.name || "").trim();
  const myEmail = String(session?.user?.email || "").trim();

  const query = myEmail
    ? { $or: [{ authorEmail: myEmail }, { author: myName }] }
    : { author: myName };

  const rawPosts = await ForumPost.find(query).sort({ createdAt: -1 }).limit(20).lean();
  const postIds = rawPosts.map((p) => p._id);
  const statsByPost = new Map();
  if (postIds.length) {
    const replyStats = await ForumReply.aggregate([
      { $match: { postId: { $in: postIds } } },
      {
        $project: {
          postId: 1,
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      {
        $group: {
          _id: "$postId",
          repliesCount: { $sum: 1 },
          commentsCount: { $sum: "$commentsCount" },
        },
      },
    ]);
    replyStats.forEach((r) => {
      statsByPost.set(String(r._id), {
        repliesCount: Number(r.repliesCount || 0),
        commentsCount: Number(r.commentsCount || 0),
      });
    });
  }

  const posts = rawPosts.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    author: p.author,
    likes: Array.isArray(p?.reactions?.likeUsers) ? p.reactions.likeUsers.length : 0,
    dislikes: Array.isArray(p?.reactions?.dislikeUsers) ? p.reactions.dislikeUsers.length : 0,
    replies: statsByPost.get(String(p._id))?.repliesCount ?? (p.replies ?? 0),
    comments: statsByPost.get(String(p._id))?.commentsCount ?? 0,
    time: p.time || "अभी",
    tag: p.tag,
  }));

  return (
    <main className="forums-page">
      <div className="forums-top-nav">
        <Link href="/forums" className="forums-back-btn forums-back-btn-top">← Back to Forums</Link>
      </div>

      <section className="forums-hero">
        <div className="forums-hero-inner">
          <div className="forums-badge">My Posts</div>
          <h1>मेरी पोस्ट</h1>
          <p>{session.user.name} की सभी पोस्ट यहां दिखाई जाएंगी।</p>
        </div>
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
              <a className="forums-post-title" href={`/forums/${p.id}`}>{p.title}</a>
              <div className="forums-post-meta">
                <span>by {p.author}</span>
                <span>• {p.replies} replies</span>
                <span>• {p.time}</span>
              </div>
              <div className="forums-post-stats">
                <span>👍 {p.likes}</span>
                <span>👎 {p.dislikes}</span>
                <span>💬 {p.comments}</span>
                <span>↩ {p.replies}</span>
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
