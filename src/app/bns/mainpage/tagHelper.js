// save tags
export default async function saveTags({ section, tags }) {
    try {
        const response = await fetch('/api/tags/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metadata: { section, tags } }),
        });
        const data = await response.json();
        console.log("Metadata saved:", data);
        return data;
    } catch (error) {
        console.error("Error saving metadata:", error);
    }
}
