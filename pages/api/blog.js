// app/api/blog/route.js
import { connectDB } from "../../lib/db";
import Blog from "../../lib/schema/blog/blog";
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};


export default async function handler(req, res) {
    await connectDB()

    const serializeBlog = (blog, includeContent = false) => ({
        _id: blog._id,
        title: blog.title,
        author: blog.author,
        excerpt: blog.excerpt,
        content: blog.content,
        likeCount: Array.isArray(blog?.reactions?.likes) ? blog.reactions.likes.length : 0,
        dislikeCount: Array.isArray(blog?.reactions?.dislikes) ? blog.reactions.dislikes.length : 0,
        commentCount: Array.isArray(blog?.comments) ? blog.comments.length : 0,
        date: blog.date,
        authorlogo: blog.authorlogo,
        image: blog.image ? `data:${blog.image.contentType};base64,${blog.image.data.toString('base64')}` : null,
        ...(includeContent ? { content: blog.content || "" } : {}),
    });

    if (req.method == "GET") {
        const { search } = req.query

        if (search) {
            let blog = null;
            if (/^[a-f\d]{24}$/i.test(search)) {
                blog = await Blog.findById(search);
            }
            if (!blog) {
                blog = await Blog.findOne({ title: search });
            }
            if (!blog) {
                return res.status(404).json({ error: "Blog not found" });
            }
            return res.status(200).json(serializeBlog(blog, true));
        }

        const blogs = await Blog.find({});
        const data = blogs.map((blog) => serializeBlog(blog));
        return res.status(200).json(data)
    }
    if (req.method == "POST") {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) return res.status(500).json({ error: "Form parse error" });
            const file = Array.isArray(files.image) ? files.image[0] : files.image;
            const fileData = fs.readFileSync(file.filepath);
            const newBlog = await Blog.create({
                title: fields.title.join(),
                excerpt: fields.excerpt.join(),
                content: fields.content.join(),
                author: fields.author.join(),
                authorlogo: fields.authorlogo.join(),
                image: {
                    data: fileData,
                    contentType: file.mimetype,
                },
            });
            res.status(200).json({ success: true });
        });
    }
}
