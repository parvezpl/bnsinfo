import { connectDB } from "../../../../../../lib/db";
import ForumPost from "../../../../../../lib/models/ForumPost";
import ForumReply from "../../../../../../lib/models/ForumReply";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../pages/api/auth/[...nextauth]";
import User from "../../../../../../lib/schema/user";

async function isAdminUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;
  if (session?.user?.role === "admin") return true;

  const dbUser = await User.findOne(
    { email: session.user.email },
    { role: 1 }
  )
    .lean()
    .exec();
  return dbUser?.role === "admin";
}

export async function GET(_req, { params }) {
  const { id } = await params;
  await connectDB();
  const post = await ForumPost.findById(id).lean();
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const replyStats = await ForumReply.aggregate([
    { $match: { postId: post._id } },
    {
      $project: {
        commentsCount: { $size: { $ifNull: ["$comments", []] } },
      },
    },
    {
      $group: {
        _id: null,
        repliesCount: { $sum: 1 },
        commentsCount: { $sum: "$commentsCount" },
      },
    },
  ]);
  const stats = replyStats[0] || { repliesCount: post.replies ?? 0, commentsCount: 0 };

  return Response.json({
    id: post._id.toString(),
    title: post.title,
    content: post.content || "",
    author: post.author,
    likes: Array.isArray(post?.reactions?.likeUsers) ? post.reactions.likeUsers.length : 0,
    dislikes: Array.isArray(post?.reactions?.dislikeUsers) ? post.reactions.dislikeUsers.length : 0,
    replies: stats.repliesCount ?? (post.replies ?? 0),
    comments: stats.commentsCount ?? 0,
    time: post.time || "अभी",
    tag: post.tag,
    category: post.category,
  });
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = await params;

  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const post = await ForumPost.findByIdAndDelete(id);
  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  await ForumReply.deleteMany({ postId: id });
  return Response.json({ ok: true, deletedPostId: id });
}
