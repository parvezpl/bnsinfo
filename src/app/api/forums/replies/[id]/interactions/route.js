import { connectDB } from "../../../../../../../lib/db";
import ForumReply from "../../../../../../../lib/models/ForumReply";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../../pages/api/auth/[...nextauth]";
import mongoose from "mongoose";
import User from "../../../../../../../lib/schema/user";

async function isAdminUser(session) {
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

function buildPayload(reply, userEmail = "") {
  const reactions = reply?.reactions || { likeUsers: [], dislikeUsers: [] };
  const likes = Array.isArray(reactions.likeUsers) ? reactions.likeUsers : [];
  const dislikes = Array.isArray(reactions.dislikeUsers) ? reactions.dislikeUsers : [];
  const comments = Array.isArray(reply?.comments) ? reply.comments : [];

  let userReaction = null;
  if (userEmail) {
    if (likes.includes(userEmail)) userReaction = "like";
    if (dislikes.includes(userEmail)) userReaction = "dislike";
  }

  return {
    ok: true,
    likes: likes.length,
    dislikes: dislikes.length,
    commentsCount: comments.length,
    userReaction,
    comments: comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((c, i) => ({
        id: String(c._id || i),
        userName: c.userName || "User",
        userImage: c.userImage || "",
        text: c.text || "",
        createdAt: c.createdAt,
      })),
  };
}

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ ok: false, error: "Invalid reply id." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userEmail = String(session?.user?.email || "").trim();

  const reply = await ForumReply.findById(id, { reactions: 1, comments: 1 }).lean();
  if (!reply) {
    return Response.json({ ok: false, error: "Reply not found." }, { status: 404 });
  }

  return Response.json(buildPayload(reply, userEmail));
}

export async function POST(req, { params }) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ ok: false, error: "Invalid reply id." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const admin = await isAdminUser(session);
  const userEmail = String(session?.user?.email || "").trim();
  const userName = String(session?.user?.name || "User").trim();
  const userImage = String(session?.user?.image || "").trim();

  if (!userEmail) {
    return Response.json({ ok: false, error: "Please login first." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "").trim();
  const text = String(body?.text || "").trim();
  const commentId = String(body?.commentId || "").trim();

  const reply = await ForumReply.findById(id);
  if (!reply) {
    return Response.json({ ok: false, error: "Reply not found." }, { status: 404 });
  }

  if (!reply.reactions) reply.reactions = { likeUsers: [], dislikeUsers: [] };
  if (!Array.isArray(reply.comments)) reply.comments = [];

  if (action === "like" || action === "dislike") {
    let likeUsers = new Set((reply.reactions.likeUsers || []).map((v) => String(v)));
    let dislikeUsers = new Set((reply.reactions.dislikeUsers || []).map((v) => String(v)));

    if (action === "like") {
      if (likeUsers.has(userEmail)) likeUsers.delete(userEmail);
      else likeUsers.add(userEmail);
      dislikeUsers.delete(userEmail);
    } else {
      if (dislikeUsers.has(userEmail)) dislikeUsers.delete(userEmail);
      else dislikeUsers.add(userEmail);
      likeUsers.delete(userEmail);
    }

    reply.reactions.likeUsers = Array.from(likeUsers);
    reply.reactions.dislikeUsers = Array.from(dislikeUsers);
  } else if (action === "comment") {
    if (!text) {
      return Response.json({ ok: false, error: "Comment is required." }, { status: 400 });
    }
    if (text.length > 800) {
      return Response.json(
        { ok: false, error: "Comment must be 800 characters or less." },
        { status: 400 }
      );
    }
    reply.comments.push({
      userEmail,
      userName,
      userImage,
      text,
      createdAt: new Date(),
    });
  } else if (action === "deleteComment") {
    if (!admin) {
      return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    if (!commentId) {
      return Response.json({ ok: false, error: "commentId is required." }, { status: 400 });
    }
    reply.comments = (reply.comments || []).filter(
      (c) => String(c?._id) !== commentId
    );
  } else {
    return Response.json({ ok: false, error: "Invalid action." }, { status: 400 });
  }

  reply.markModified("reactions");
  reply.markModified("comments");
  await reply.save();

  return Response.json(buildPayload(reply.toObject(), userEmail));
}
