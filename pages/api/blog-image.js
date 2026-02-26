import { connectDB } from "../../lib/db";
import Blog from "../../lib/schema/blog/blog";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = String(req.query.id || "").trim();
  if (!id) return res.status(400).json({ error: "id is required" });

  await connectDB();
  const blog = await Blog.findById(id, { image: 1 }).lean();
  if (!blog?.image?.data) return res.status(404).end("Not found");

  res.setHeader("Content-Type", blog.image.contentType || "image/jpeg");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  return res.status(200).send(blog.image.data);
}

