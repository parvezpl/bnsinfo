// save tags
export default async function saveTags({ section, tags }) {
    // This function would typically send the tags to a server with api
    // console.log(section, tags)
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
        return data; // Return the response data if needed
    } catch (error) {
        console.error("Error saving metadata:", error);
    }
}
