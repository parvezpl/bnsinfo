import { connectDB } from "../../../../../../../lib/db";
import ForumPost from "../../../../../../../lib/models/ForumPost";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../../pages/api/auth/[...nextauth]";
import mongoose from "mongoose";

function buildPayload(post, userEmail = "") {
  const reactions = post?.reactions || { likeUsers: [], dislikeUsers: [] };
  const likes = Array.isArray(reactions.likeUsers) ? reactions.likeUsers : [];
  const dislikes = Array.isArray(reactions.dislikeUsers) ? reactions.dislikeUsers : [];

  let userReaction = null;
  if (userEmail) {
    if (likes.includes(userEmail)) userReaction = "like";
    if (dislikes.includes(userEmail)) userReaction = "dislike";
  }

  return {
    ok: true,
    likes: likes.length,
    dislikes: dislikes.length,
    userReaction,
  };
}

export async function GET(_req, { params }) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ ok: false, error: "Invalid post id." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userEmail = String(session?.user?.email || "").trim();

  const post = await ForumPost.findById(id, { reactions: 1 }).lean();
  if (!post) {
    return Response.json({ ok: false, error: "Post not found." }, { status: 404 });
  }

  return Response.json(buildPayload(post, userEmail));
}

export async function POST(req, { params }) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ ok: false, error: "Invalid post id." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userEmail = String(session?.user?.email || "").trim();
  if (!userEmail) {
    return Response.json({ ok: false, error: "Please login first." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "").trim();
  if (action !== "like" && action !== "dislike") {
    return Response.json({ ok: false, error: "Invalid action." }, { status: 400 });
  }

  const post = await ForumPost.findById(id);
  if (!post) {
    return Response.json({ ok: false, error: "Post not found." }, { status: 404 });
  }

  if (!post.reactions) post.reactions = { likeUsers: [], dislikeUsers: [] };

  const likeUsers = new Set((post.reactions.likeUsers || []).map((v) => String(v)));
  const dislikeUsers = new Set((post.reactions.dislikeUsers || []).map((v) => String(v)));

  if (action === "like") {
    if (likeUsers.has(userEmail)) likeUsers.delete(userEmail);
    else likeUsers.add(userEmail);
    dislikeUsers.delete(userEmail);
  } else {
    if (dislikeUsers.has(userEmail)) dislikeUsers.delete(userEmail);
    else dislikeUsers.add(userEmail);
    likeUsers.delete(userEmail);
  }

  post.reactions.likeUsers = Array.from(likeUsers);
  post.reactions.dislikeUsers = Array.from(dislikeUsers);
  post.markModified("reactions");
  await post.save();

  return Response.json(buildPayload(post.toObject(), userEmail));
}

