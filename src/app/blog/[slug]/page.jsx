import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/seo";
import Link from "next/link";
import styles from "./page.module.css";
import BlogInteractions from "./BlogInteractions";

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
    const content = String(post.content || post.excerpt || "");
    const normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
    const wordCount = normalizedContent.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

    return (
        <main className={styles.page}>
            <div className={styles.glowLeft} />
            <div className={styles.glowRight} />

            <article className={styles.container}>
                <Link href="/blog" className={styles.backLink}>
                    ← Back to Blogs
                </Link>

                <header className={styles.hero}>
                    <div className={styles.metaRow}>
                        <span className={styles.badge}>
                            BNS Info Blog
                        </span>
                        <span className={styles.readChip}>
                            {readMinutes} min read
                        </span>
                    </div>

                    <h1 className={styles.title}>
                        {post.title}
                    </h1>

                    <div className={styles.chips}>
                        <span className={styles.dateChip}>{post.date}</span>
                        {post.author ? (
                            <span className={styles.authorChip}>
                                लेखक: {post.author}
                            </span>
                        ) : null}
                        <span className={styles.wordsChip}>
                            {wordCount} words
                        </span>
                    </div>

                    {post.excerpt ? (
                        <p className={styles.excerpt}>
                            {post.excerpt}
                        </p>
                    ) : null}
                </header>

                {post.image ? (
                    <div className={styles.imageWrap}>
                        <img
                            src={post.image}
                            alt={post.title || "Blog image"}
                            className={styles.image}
                        />
                        <div className={styles.imageFade} />
                    </div>
                ) : null}

                <section className={styles.contentCard}>
                    {looksLikeHtml ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: content }}
                            className={styles.prose}
                        />
                    ) : (
                        <article
                            className={styles.plainText}
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {normalizedContent}
                        </article>
                    )}
                </section>

                <BlogInteractions blogId={post._id} />
            </article>
        </main>
    );
}
