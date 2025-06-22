export async function FetchBlog(slug) {
    try {
        const res = await fetch(`/api/blog/?search=${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        // console.log("Fetched blog:", data);
        return data
    } catch (err) {
        setError("❌ Blog not found.");
    }
}