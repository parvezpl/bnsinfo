import { connectDB } from "../../../../../../lib/db";
import ForumPost from "../../../../../../lib/models/ForumPost";

export async function GET(_req, { params }) {
  const { id } = await params;
  await connectDB();
  const post = await ForumPost.findById(id).lean();
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }
  return Response.json({
    id: post._id.toString(),
    title: post.title,
    content: post.content || "",
    author: post.author,
    replies: post.replies ?? 0,
    time: post.time || "अभी",
    tag: post.tag,
    category: post.category,
  });
}
