import { connectDB } from "../../../../../../lib/db";
import ForumReply from "../../../../../../lib/models/ForumReply";
import ForumPost from "../../../../../../lib/models/ForumPost";
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

function canEditReplyByOwner(reply, session) {
  const userEmail = String(session?.user?.email || "").trim().toLowerCase();
  const userName = String(session?.user?.name || "").trim().toLowerCase();
  const replyEmail = String(reply?.authorEmail || "").trim().toLowerCase();
  const replyAuthor = String(reply?.author || "").trim().toLowerCase();
  return (userEmail && replyEmail && userEmail === replyEmail) || (userName && replyAuthor && userName === replyAuthor);
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = await isAdminUser();

  const reply = await ForumReply.findById(id);
  if (!reply) {
    return Response.json({ error: "Reply not found" }, { status: 404 });
  }

  if (!isAdmin && !canEditReplyByOwner(reply, session)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const content = String(body?.content || "").trim();
  if (!content) {
    return Response.json({ error: "Reply content is required." }, { status: 400 });
  }

  reply.content = content;
  await reply.save();

  return Response.json({
    ok: true,
    id: reply._id.toString(),
    content: reply.content,
  });
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const isAdmin = await isAdminUser();
  const existingReply = await ForumReply.findById(id).lean();
  if (!existingReply) {
    return Response.json({ error: "Reply not found" }, { status: 404 });
  }

  if (!isAdmin && !canEditReplyByOwner(existingReply, session)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const reply = await ForumReply.findByIdAndDelete(id).lean();

  await ForumPost.findByIdAndUpdate(reply.postId, { $inc: { replies: -1 } });
  return Response.json({ ok: true, deletedReplyId: id });
}
