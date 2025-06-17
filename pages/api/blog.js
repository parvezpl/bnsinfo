// app/api/blog/route.js
import { connectDB } from "../../lib/db";
import Blog from "../../lib/schema/blog";

export default async function handler(req, res) {
    await connectDB()
    if (req.method == "GET") {
        const { search } = req.query
        const blogs = await Blog.find({});
        if (search) {
            const filteredBlogs = blogs.filter(blog => blog.slug.includes(search));
            console.log("Filtered blogs:", filteredBlogs);
            if (filteredBlogs.length === 0) {
                return res.status(404).json({ message: "No blogs found" });
            }
            return res.status(200).json(filteredBlogs[0]);
        }
        return res.status(200).json(blogs)
    }
    if (req.method == "POST") {
        const body = await req.body;
        console.log("Creating new blog post:", body);
        const newBlog = await Blog.create(body);
        return res.status(200).json(newBlog)
    }
}
