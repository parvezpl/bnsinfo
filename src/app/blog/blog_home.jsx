import React from "react";
import styles from "./blog_home.module.css";

export default async function Blog_home() {
    const getdata = async () => {
        const tempblogs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/blog`, {
            cache: "no-store",
        });
        if (!tempblogs.ok) throw new Error("Failed to fetch blogs");
        return tempblogs.json();
    };

    const blogs = await getdata();
    const featured = blogs?.[0];
    const recent = blogs?.slice(1, 5) || [];
    const topTags = ["BNS Updates", "Legal Explainers", "Case Notes", "Policy", "AI & Law"];
    const lastUpdated = new Date().toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const highlights = [
        {
            title: "BNS में नए बदलाव",
            text: "नए प्रावधानों और संशोधनों का संक्षिप्त सार।",
            link: "#",
        },
        {
            title: "केस नोट्स",
            text: "ताज़ा फैसलों का आसान विश्लेषण और प्रमुख निष्कर्ष।",
            link: "#",
        },
        {
            title: "प्रैक्टिस टूलकिट",
            text: "ड्राफ्ट, चेकलिस्ट और त्वरित संदर्भ सामग्री।",
            link: "#",
        },
    ];
    const updates = [
        { title: "BNS अपडेट: फरवरी 2026", date: "02 Feb 2026" },
        { title: "न्याय संहिता सारांश (PDF)", date: "28 Jan 2026" },
        { title: "प्रक्रिया गाइड: FIR से चार्जशीट", date: "20 Jan 2026" },
    ];

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroText}>
                        <p className={styles.heroEyebrow}>BNS Info Blog</p>
                        <h1 className={styles.heroTitle}>भारतीय कानून की जानकारी</h1>
                        <p className={styles.heroSubtitle}>न्याय संहिता, कानून एवं नीतियों की सरल जानकारी व अपडेट</p>
                        <div className={styles.heroMeta}>अंतिम अपडेट: {lastUpdated} · {blogs.length} पोस्ट</div>
                    </div>
                    <form className={styles.searchBox}>
                        <label className={styles.searchLabel}>Search articles</label>
                        <div className={styles.searchRow}>
                            <input
                                type="text"
                                name="q"
                                placeholder="Search by title, topic, or section"
                                className={styles.searchInput}
                            />
                            <button className={styles.searchButton}>
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                <div className={styles.tagRow}>
                    {topTags.map((tag) => (
                        <span key={tag} className={styles.tagChip}>
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            {featured && (
                <section className={styles.featured}>
                    <div className={styles.featuredCard}>
                        <img src={featured.image || "/default-image.jpg"} alt="featured" className={styles.featuredImage} />
                        <div className={styles.featuredBody}>
                            <p className={styles.featuredLabel}>Featured</p>
                            <h2 className={styles.featuredTitle}>
                                <a href={`/blog/${featured._id}`} className={styles.featuredLink}>
                                    {featured.title}
                                </a>
                            </h2>
                            <div className={styles.meta}>लेखक: {featured.author} | {featured.date}</div>
                            <p className={styles.excerpt}>{featured.excerpt}</p>
                            <div className={styles.featuredActions}>
                                <a href={`/blog/${featured._id}`} className={styles.primaryButton}>
                                    Read full article
                                </a>
                                <span className={styles.readTime}>5 min read</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.highlights}>
                <div className={styles.highlightsGrid}>
                    {highlights.map((item) => (
                        <div key={item.title} className={styles.highlightCard}>
                            <h3 className={styles.highlightTitle}>{item.title}</h3>
                            <p className={styles.highlightText}>{item.text}</p>
                            <a href={item.link} className={styles.highlightLink}>विस्तार से पढ़ें</a>
                        </div>
                    ))}
                </div>
            </section>

            <div className={styles.layout}>
                <main className={styles.main}>
                    <div className={styles.sectionHead}>
                        <h3 className={styles.sectionTitle}>Latest Articles</h3>
                        <div className={styles.sectionMeta}>{blogs.length} posts</div>
                    </div>

                    <div className={styles.cardList}>
                        {blogs.map((blog) => (
                            <article key={blog._id} className={styles.card}>
                                <img src={blog.image || "/default-image.jpg"} alt="thumbnail" className={styles.cardImage} />
                                <div className={styles.cardBody}>
                                    <h2 className={styles.cardTitle}>
                                        <a href={`/blog/${blog._id}`} className={styles.cardLink}>
                                            {blog.title}
                                        </a>
                                    </h2>
                                    <div className={styles.meta}>लेखक: {blog.author} | {blog.date}</div>
                                    <p className={styles.excerpt}>{blog.excerpt}</p>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.badge}>Legal</span>
                                        <span className={styles.readTime}>4-6 min read</span>
                                        <a href={`/blog/${blog._id}`} className={styles.readMore}>Read more</a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {blogs.length === 0 && (
                        <div className={styles.empty}>
                            <p className={styles.emptyTitle}>No posts yet</p>
                            <p className={styles.emptyText}>New legal explainers will appear here.</p>
                        </div>
                    )}
                </main>

                <aside className={styles.sidebar}>
                    <section className={styles.panel}>
                        <h3 className={styles.panelTitle}>Blog Snapshot</h3>
                        <div className={styles.stats}>
                            <div className={styles.statBox}>
                                <div className={styles.statValue}>{blogs.length}</div>
                                <div className={styles.statLabel}>Posts</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statValue}>12</div>
                                <div className={styles.statLabel}>Topics</div>
                            </div>
                            <div className={styles.statBox}>
                                <div className={styles.statValue}>3</div>
                                <div className={styles.statLabel}>Languages</div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.panel}>
                        <div className={styles.authorRow}>
                            <img src="/a2.jpg" alt="Author" className={styles.authorImage} />
                            <div>
                                <h3 className={styles.panelTitle}>About Blog</h3>
                                <p className={styles.panelText}>कानून विश्लेषक और लेखक। BNS Info पर सटीक और सरल जानकानकारी देने के लिए प्रतिबद्ध।</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.panel}>
                        <h3 className={styles.panelTitle}>Recent Posts</h3>
                        <ul className={styles.recentList}>
                            {recent.map((item) => (
                                <li key={item._id} className={styles.recentItem}>
                                    <img src={item.image || "/default-image.jpg"} alt="thumb" className={styles.recentThumb} />
                                    <a href={`/blog/${item._id}`} className={styles.recentLink}>
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.panel}>
                        <h3 className={styles.panelTitle}>नए अपडेट्स</h3>
                        <ul className={styles.updatesList}>
                            {updates.map((item) => (
                                <li key={item.title} className={styles.updateItem}>
                                    <span className={styles.updateTitle}>{item.title}</span>
                                    <span className={styles.updateDate}>{item.date}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className={styles.panel}>
                        <h3 className={styles.panelTitle}>आर्काइव (महीनों के अनुसार)</h3>
                        <ul className={styles.linkList}>
                            <li><a href="#">जून 2025</a></li>
                            <li><a href="#">मई 2025</a></li>
                            <li><a href="#">अप्रैल 2025</a></li>
                        </ul>
                    </section>

                    <section className={styles.panel}>
                        <h3 className={styles.panelTitle}>श्रेणियाँ</h3>
                        <ul className={styles.linkList}>
                            <li><a href="#">BNS Updates</a></li>
                            <li><a href="#">कानूनी समाचार</a></li>
                            <li><a href="#">विश्लेषण</a></li>
                            <li><a href="#">धाराएँ और धाराएँ</a></li>
                        </ul>
                    </section>

                    <section className={styles.newsletter}>
                        <h3 className={styles.newsTitle}>Weekly Legal Brief</h3>
                        <p className={styles.newsText}>Get crisp legal updates in your inbox.</p>
                        <div className={styles.newsRow}>
                            <input type="email" placeholder="you@email.com" className={styles.newsInput} />
                            <button className={styles.newsButton}>Join</button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
