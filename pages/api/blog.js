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
    if (req.method == "GET") {
        const { search } = req.query
        const blogs = await Blog.find({});
        let data = blogs.map((blog) => ({
            _id: blog._id,
            title: blog.title,
            author: blog.author,
            excerpt: blog.excerpt,
            date: blog.date,
            authorlogo: blog.authorlogo,
            image: blog.image ? `data:${blog.image.contentType};base64,${blog.image.data.toString('base64')}` : null,
        }));
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
