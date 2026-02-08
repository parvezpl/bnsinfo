import { connectDB } from "../../../../../lib/db";
import ForumPost from "../../../../../lib/models/ForumPost";

const DEFAULT_POSTS = [
  { title: "धारा 144 का वास्तविक प्रभाव क्या है?", author: "Rohit", replies: 18, time: "2 घंटे पहले", tag: "धारा", category: "general" },
  { title: "IPC 1860 से BNS 2023 में सबसे बड़ा बदलाव?", author: "Anita", replies: 31, time: "5 घंटे पहले", tag: "तुलना", category: "updates" },
  { title: "साइबर अपराध पर नई धाराएँ कौन सी हैं?", author: "Mohit", replies: 12, time: "1 दिन पहले", tag: "साइबर", category: "sections" },
  { title: "महिला सुरक्षा से जुड़ी प्रमुख धाराएँ", author: "Pooja", replies: 24, time: "2 दिन पहले", tag: "महिला", category: "general" },
];

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const author = searchParams.get("author");
  const query = author ? { author } : {};

  let posts = await ForumPost.find(query).sort({ createdAt: -1 }).limit(20).lean();
  if (!posts.length) {
    await ForumPost.insertMany(DEFAULT_POSTS);
    posts = await ForumPost.find(query).sort({ createdAt: -1 }).limit(20).lean();
  }

  return Response.json({
    posts: posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      author: p.author,
      replies: p.replies ?? 0,
      time: p.time || "अभी",
      tag: p.tag,
      category: p.category,
    })),
  });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { title, author, tag, category, time, content } = body || {};
  if (!title || !author || !tag || !category) {
    return Response.json(
      { error: "Missing required fields: title, author, tag, category" },
      { status: 400 }
    );
  }

  const post = await ForumPost.create({
    title,
    author,
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
