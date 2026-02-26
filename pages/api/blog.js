// app/api/blog/route.js
import { connectDB } from "../../lib/db";
import Blog from "../../lib/schema/blog/blog";
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import User from "../../lib/schema/user";

export const config = {
    api: {
        bodyParser: false,
    },
};


export default async function handler(req, res) {
    await connectDB()

    const getSessionUser = async () => {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user) return null;
        return session.user;
    };

    const isAdminRequest = async () => {
        const user = await getSessionUser();
        if (!user?.email) return false;
        if (user?.role === "admin") return true;
        const dbUser = await User.findOne({ email: user.email }, { role: 1 }).lean();
        return dbUser?.role === "admin";
    };

    const isAuthorRequest = async (blog) => {
        const user = await getSessionUser();
        if (!user) return false;
        const byName =
            String(user?.name || "").trim().toLowerCase() ===
            String(blog?.author || "").trim().toLowerCase();
        const userId = String(user?.id || user?._id || "").trim();
        const byUserId = !!userId && !!blog?.user && String(blog.user) === userId;
        return byName || byUserId;
    };

    const serializeBlog = (blog, options = {}) => {
        const includeContent = !!options.includeContent;
        const includeImage = !!options.includeImage;
        return ({
        _id: String(blog._id),
        title: blog.title,
        author: blog.author,
        excerpt: blog.excerpt,
        content: includeContent ? (blog.content || "") : undefined,
        likeCount: Array.isArray(blog?.reactions?.likes) ? blog.reactions.likes.length : 0,
        dislikeCount: Array.isArray(blog?.reactions?.dislikes) ? blog.reactions.dislikes.length : 0,
        commentCount: Array.isArray(blog?.comments) ? blog.comments.length : 0,
        date: blog.date,
        authorlogo: blog.authorlogo,
        image: includeImage && blog.image
            ? `data:${blog.image.contentType};base64,${blog.image.data.toString('base64')}`
            : null,
        });
    };

    if (req.method == "GET") {
        const { search, includeImage } = req.query

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
            const wantImage = String(includeImage || "1") !== "0";
            return res.status(200).json(
                serializeBlog(blog, { includeContent: true, includeImage: wantImage })
            );
        }

        const blogs = await Blog.find({}).sort({ createdAt: -1, _id: -1 });
        const wantImage = String(includeImage || "0") === "1";
        const data = blogs.map((blog) => serializeBlog(blog, { includeImage: wantImage }));
        return res.status(200).json(data)
    }
    if (req.method == "POST") {
        const sessionUser = await getSessionUser();
        const form = new IncomingForm();
        return form.parse(req, async (err, fields, files) => {
            if (err) return res.status(500).json({ error: "Form parse error" });
            const file = Array.isArray(files.image) ? files.image[0] : files.image;
            const fileData = fs.readFileSync(file.filepath);
            const authorValue = String(fields.author?.[0] || sessionUser?.name || "").trim();
            const authorlogoValue = String(fields.authorlogo?.[0] || sessionUser?.image || "").trim();
            const userId = String(sessionUser?.id || sessionUser?._id || "").trim();
            const newBlog = await Blog.create({
                title: fields.title.join(),
                excerpt: fields.excerpt.join(),
                content: fields.content.join(),
                author: authorValue,
                authorlogo: authorlogoValue,
                ...(userId && /^[a-f0-9]{24}$/i.test(userId) ? { user: userId } : {}),
                image: {
                    data: fileData,
                    contentType: file.mimetype,
                },
            });
            res.status(200).json({ success: true });
        });
    }

    if (req.method === "PUT") {
        const form = new IncomingForm();
        return form.parse(req, async (err, fields, files) => {
            if (err) return res.status(500).json({ error: "Form parse error" });
            const id = String(fields.id?.[0] || req.query.id || "").trim();
            if (!id) return res.status(400).json({ error: "id is required" });

            const blog = await Blog.findById(id);
            if (!blog) return res.status(404).json({ error: "Blog not found" });
            const isAdmin = await isAdminRequest();
            const isAuthor = await isAuthorRequest(blog);
            if (!isAdmin && !isAuthor) {
                return res.status(403).json({ error: "Only post author can modify." });
            }

            if (fields.title?.[0] !== undefined) blog.title = fields.title[0];
            if (fields.excerpt?.[0] !== undefined) blog.excerpt = fields.excerpt[0];
            if (fields.content?.[0] !== undefined) blog.content = fields.content[0];
            if (fields.author?.[0] !== undefined) blog.author = fields.author[0];

            const file = Array.isArray(files.image) ? files.image[0] : files.image;
            if (file?.filepath) {
                const fileData = fs.readFileSync(file.filepath);
                blog.image = {
                    data: fileData,
                    contentType: file.mimetype,
                };
            }

            await blog.save();
            return res.status(200).json({
                success: true,
                data: serializeBlog(blog, { includeContent: true, includeImage: true }),
            });
        });
    }

    if (req.method === "DELETE") {
        const isAdmin = await isAdminRequest();
        if (!isAdmin) return res.status(403).json({ error: "Forbidden" });

        const id = String(req.query.id || "").trim();
        if (!id) return res.status(400).json({ error: "id is required" });

        const deleted = await Blog.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Blog not found" });
        return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
