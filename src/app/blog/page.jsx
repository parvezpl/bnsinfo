"use client";
// app/blog/page.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingCard from "../bns/mainpage/[lang]/loading";
export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        async function fetchBlogs() {
            try {
                setLoading(true)
                const res = await fetch("/api/blog");
                const data = await res.json();
                setBlogs(data);
                setLoading(false)
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
                
                { loading ? 
                <LoadingCard/>
                :blogs.map((post) => (
                    <div key={post.slug} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto"
                        >
                            <p className="text-sm text-gray-500">{post.date}</p>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                            <p className="text-gray-600 mb-2">{post.summary}</p>
                            <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium">
                                Read More →
                            </Link>
                        </motion.div>
                    </div>
                ))}

            </div>
        </main >
    );
}
