import { connectDB } from "../../lib/db";
import Blog from "../../lib/schema/blog/blog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "daily", priority: 0.9 },
    { path: "/forums", changeFrequency: "daily", priority: 0.8 },
    { path: "/bns/bnshome", changeFrequency: "weekly", priority: 0.8 },
    { path: "/bns/mainpage", changeFrequency: "weekly", priority: 0.8 },
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries = [];
  try {
    await connectDB();
    const blogs = await Blog.find({}, { _id: 1, date: 1 }).lean();
    blogEntries = blogs.map((blog) => {
      const lastModified = blog.date ? new Date(blog.date) : now;
      return {
        url: absoluteUrl(`/blog/${blog._id}`),
        lastModified: Number.isNaN(lastModified.getTime()) ? now : lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch {
    blogEntries = [];
  }

  return [...staticEntries, ...blogEntries];
}
