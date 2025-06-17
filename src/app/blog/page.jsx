"use client";
// app/blog/page.jsx
import { useEffect, useState } from "react";
import Link from "next/link";

// const blogPosts = [
//     {
//         slug: "introduction-to-bns-2023",
//         title: "Introduction to Bhartiya Nyay Sanhita 2023",
//         summary: "Understand the core changes introduced in BNS 2023 and how it replaces IPC.",
//         date: "2025-06-17",
//     },
//     {
//         slug: "ai-in-legal-search",
//         title: "How AI is Revolutionizing Legal Search",
//         summary: "Learn how BNSINFO uses AI to simplify complex legal queries.",
//         date: "2025-06-15",
//     },
// ];

// export const metadata = {
//   title: "BNSINFO Blog - Bhartiya Nyay Sanhita Insights",
//   description: "Latest updates and AI-powered legal insights on BNS 2023.",
// };

export default function BlogPage() {

    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        async function fetchBlogs() {
            try {
                const res = await fetch("/api/blog");
                const data = await res.json();
                setBlogs(data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
            }
        }

        fetchBlogs();
    }, []);

    return (
        <main className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">BNSINFO Blog</h1>

            <div className="space-y-6">
                {blogs.map((post) => (
                    <div key={post.slug} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                        <p className="text-sm text-gray-500">{post.date}</p>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                        <p className="text-gray-600 mb-2">{post.summary}</p>
                        <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium">
                            Read More →
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}
