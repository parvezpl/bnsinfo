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

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = await params;

  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const reply = await ForumReply.findByIdAndDelete(id).lean();
  if (!reply) {
    return Response.json({ error: "Reply not found" }, { status: 404 });
  }

  await ForumPost.findByIdAndUpdate(reply.postId, { $inc: { replies: -1 } });
  return Response.json({ ok: true, deletedReplyId: id });
}
