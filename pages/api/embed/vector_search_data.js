// pages/api/ai/vector_search.js
import client from "../../../lib/qdrant";
import { getAIVector } from "./multilang_vector";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { text } = req.body;

            if (!text || typeof text !== "string") {
                return res.status(400).json({ error: "Invalid or missing 'text' in request body" });
            }
            const vector = await getAIVector(text)
            console.log("Generated Vectoraaa:", vector);
            if (!Array.isArray(vector) || vector.length === 0) {
                return res.status(400).json({ error: "Generated vector is invalid" });
            }

            const searchResult = await client.search("sections_hindi_vector", {
                vector: vector,
                limit: 5,
                with_payload: true,
            });

            console.log("Search Result:", searchResult);

            return res.status(200).json({ searchResult });

        } catch (error) {
            console.error("Qdrant search error:", error);
            return res.status(500).json({
                error: "Vector search failed",
                details: error.message,
            });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
