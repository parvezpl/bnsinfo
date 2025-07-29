// pages/api/ai/vector_search.js
import client from "../../../lib/qdrant";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { vector, lang } = req.body;
            console.log("Received vector:", lang);
            if (!vector || !Array.isArray(vector)) {
                return res.status(400).json({ error: "Invalid or missing vector" });
            }
            
            const collection = lang === "hi" ? "sections_hindi_vector" : "sectionsvector";

            console.log(vector)
            const searchResult = await client.search(collection, {
                vector: vector,
                limit: 5,
                with_payload: true, // Optional: include payload
            });

            console.log("Search result:", searchResult);

            return res.status(200).json({ searchResult });
        } catch (error) {
            console.error("Qdrant search error:", error);
            return res.status(500).json({ error: "Vector search failed", details: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
