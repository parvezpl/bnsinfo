// app/blog/page.jsx (SERVER COMPONENT)
import Blog_home from "./blog_home";

export default function BlogPage() {

    return (
        <main className="max-w-full mx-auto ">
            <Blog_home/>
            {/* <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">BNSINFO Blog</h1>
            <div className="space-y-6">
                {blogs.map((post) => (
                    <div key={post.slug} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                            <p className="text-sm text-gray-500">{post.date}</p>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                            <p className="text-gray-600 mb-2">{post.summary}</p>
                            <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium">
                                Read More â†’
                            </Link>
                    </div>
                ))}
            </div> */}
        </main>
    );
}



