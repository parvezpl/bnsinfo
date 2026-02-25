import { connectDB } from "../../../../../lib/db";
import ForumPost from "../../../../../lib/models/ForumPost";
import ForumReply from "../../../../../lib/models/ForumReply";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";

const DEFAULT_POSTS = [
  { title: "धारा 144 का वास्तविक प्रभाव क्या है?", author: "Rohit", replies: 18, time: "2 घंटे पहले", tag: "धारा", category: "general" },
  { title: "IPC 1860 से BNS 2023 में सबसे बड़ा बदलाव?", author: "Anita", replies: 31, time: "5 घंटे पहले", tag: "तुलना", category: "updates" },
  { title: "साइबर अपराध पर नई धाराएँ कौन सी हैं?", author: "Mohit", replies: 12, time: "1 दिन पहले", tag: "साइबर", category: "sections" },
  { title: "महिला सुरक्षा से जुड़ी प्रमुख धाराएँ", author: "Pooja", replies: 24, time: "2 दिन पहले", tag: "महिला", category: "general" },
];

function escapeRegex(text = "") {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const author = searchParams.get("author");
  const mine = searchParams.get("mine") === "1";
  const category = String(searchParams.get("category") || "").trim();
  const tag = String(searchParams.get("tag") || "").trim();
  const q = String(searchParams.get("q") || "").trim();

  const conditions = [];
  if (mine) {
    const myEmail = String(session?.user?.email || "").trim();
    const myName = String(session?.user?.name || "").trim();
    if (!myName && !myEmail) {
      return Response.json({ posts: [], error: "Unauthorized" }, { status: 401 });
    }
    conditions.push(
      myEmail
        ? { $or: [{ authorEmail: myEmail }, { author: myName }] }
        : { author: myName }
    );
  } else if (author) {
    conditions.push({ author });
  }

  if (category) {
    conditions.push({ category });
  }

  if (tag) {
    conditions.push({ tag: { $regex: escapeRegex(tag), $options: "i" } });
  }

  if (q) {
    const regex = { $regex: escapeRegex(q), $options: "i" };
    conditions.push({
      $or: [{ title: regex }, { content: regex }, { tag: regex }, { author: regex }],
    });
  }

  const query = conditions.length ? { $and: conditions } : {};
  let posts = await ForumPost.find(query).sort({ createdAt: -1 }).limit(20).lean();
  if (!posts.length && !mine && !author && !category && !tag && !q) {
    const defaultTitles = DEFAULT_POSTS.map((p) => p.title);
    const existingDefaults = await ForumPost.find(
      { title: { $in: defaultTitles } },
      { title: 1 }
    ).lean();
    const existingTitleSet = new Set(existingDefaults.map((p) => String(p.title)));
    const missingDefaults = DEFAULT_POSTS.filter((p) => !existingTitleSet.has(String(p.title)));
    if (missingDefaults.length) {
      await ForumPost.insertMany(missingDefaults);
    }
    posts = await ForumPost.find(query).sort({ createdAt: -1 }).limit(20).lean();
  }

  const postIds = posts.map((p) => p._id);
  const statsByPost = new Map();
  if (postIds.length) {
    const replyStats = await ForumReply.aggregate([
      { $match: { postId: { $in: postIds } } },
      {
        $project: {
          postId: 1,
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
          likeCount: { $size: { $ifNull: ["$reactions.likeUsers", []] } },
          dislikeCount: { $size: { $ifNull: ["$reactions.dislikeUsers", []] } },
        },
      },
      {
        $group: {
          _id: "$postId",
          repliesCount: { $sum: 1 },
          commentsCount: { $sum: "$commentsCount" },
          replyLikesCount: { $sum: "$likeCount" },
          replyDislikesCount: { $sum: "$dislikeCount" },
        },
      },
    ]);
    replyStats.forEach((r) => {
      statsByPost.set(String(r._id), {
        repliesCount: Number(r.repliesCount || 0),
        commentsCount: Number(r.commentsCount || 0),
        replyLikesCount: Number(r.replyLikesCount || 0),
        replyDislikesCount: Number(r.replyDislikesCount || 0),
      });
    });
  }

  return Response.json({
    posts: posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      author: p.author,
      likes: Array.isArray(p?.reactions?.likeUsers) ? p.reactions.likeUsers.length : 0,
      dislikes: Array.isArray(p?.reactions?.dislikeUsers) ? p.reactions.dislikeUsers.length : 0,
      replies: statsByPost.get(String(p._id))?.repliesCount ?? (p.replies ?? 0),
      comments: statsByPost.get(String(p._id))?.commentsCount ?? 0,
      replyLikes: statsByPost.get(String(p._id))?.replyLikesCount ?? 0,
      replyDislikes: statsByPost.get(String(p._id))?.replyDislikesCount ?? 0,
      time: p.time || "अभी",
      tag: p.tag,
      category: p.category,
    })),
  });
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const { title, author, tag, category, time, content } = body || {};
  const sessionEmail = String(session?.user?.email || "").trim();
  const sessionAuthor = String(session?.user?.name || "").trim();
  const finalAuthor = sessionAuthor || String(author || "").trim();

  if (!title || !finalAuthor || !tag || !category) {
    return Response.json(
      { error: "Missing required fields: title, author, tag, category" },
      { status: 400 }
    );
  }

  const post = await ForumPost.create({
    title,
    author: finalAuthor,
    authorEmail: sessionEmail,
    tag,
    category,
    time: time || "",
    content: content || "",
  });

  return Response.json({
    id: post._id.toString(),
    title: post.title,
    content: post.content || "",
    author: post.author,
    replies: post.replies ?? 0,
    time: post.time || "अभी",
    tag: post.tag,
    category: post.category,
  }, { status: 201 });
}
