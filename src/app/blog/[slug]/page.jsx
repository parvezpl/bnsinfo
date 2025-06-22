// app/blog/[slug]/page.jsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {FetchBlog} from './fetchblog'

const blogs = {
    "introduction-to-bns-2023": {
        title: "Introduction to Bhartiya Nyay Sanhita 2023",
        content: `
      The Bhartiya Nyay Sanhita 2023 (BNS) replaces the Indian Penal Code (IPC).
      This marks a major shift in how legal justice is delivered in India...
    `,
        date: "2025-06-17",
    },
    "ai-in-legal-search": {
        title: "How AI is Revolutionizing Legal Search",
        content: `
      With the rise of AI, platforms like BNSINFO make legal research easier than ever...
    `,
        date: "2025-06-15",
    },
};

// export  function generateStaticParams() {
//     return Object.keys(blogs).map((slug) => ({ slug }));
// }

export default function BlogPost({ params }) {

    const { slug } = useParams();
    const [post, setPost] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchBlog() {
           const data = await FetchBlog(slug)
           setPost(data)
        }

        if (slug) fetchBlog();
    }, [slug]);

    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!post) return <div className="p-6">Post not found</div>;

    return (
        <main className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-6">{post.date}</p>
             <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose max-w-none" />
            {/* <article className="prose max-w-none">{post.content}</article> */}
        </main>
    );
}
