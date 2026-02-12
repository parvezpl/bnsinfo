import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/seo";

async function getBlogPost(slug) {
    const res = await fetch(absoluteUrl(`/api/blog?search=${encodeURIComponent(slug)}`), {
        next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    return res.json();
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
            robots: { index: false, follow: false },
        };
    }

    const description = post.excerpt || "Legal analysis and updates on BNS Info.";

    return {
        title: post.title,
        description,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description,
            type: "article",
            url: `/blog/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description,
        },
    };
}

export default async function BlogPost({ params }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) notFound();

    return (
        <main className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-6">{post.date}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || "" }} className="prose max-w-none" />
        </main>
    );
}
