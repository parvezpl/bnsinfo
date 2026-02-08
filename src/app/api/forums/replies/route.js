import { connectDB } from "../../../../../lib/db";
import ForumReply from "../../../../../lib/models/ForumReply";
import ForumPost from "../../../../../lib/models/ForumPost";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) {
    return Response.json({ error: "postId is required" }, { status: 400 });
  }
  const replies = await ForumReply.find({ postId }).sort({ createdAt: -1 }).lean();
  return Response.json({
    replies: replies.map((r) => ({
      id: r._id.toString(),
      postId: r.postId.toString(),
      author: r.author,
      content: r.content,
      time: r.createdAt,
    })),
  });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { postId, author, content } = body || {};
  if (!postId || !author || !content) {
    return Response.json(
      { error: "Missing required fields: postId, author, content" },
      { status: 400 }
    );
  }

  const reply = await ForumReply.create({ postId, author, content });
  await ForumPost.findByIdAndUpdate(postId, { $inc: { replies: 1 } });

  return Response.json({
    id: reply._id.toString(),
    postId: reply.postId.toString(),
    author: reply.author,
    content: reply.content,
    time: reply.createdAt,
  }, { status: 201 });
}
