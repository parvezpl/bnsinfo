// make api with qdrant 

import client from "../../../lib/qdrant";
import { getAIVector } from "../embed/multilang_vector";
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { metadata } = req.body;
        if (!metadata) {
            return res.status(400).json({ error: "Invalid metadata format" });
        }

        try {
            const vectors = await Promise.all(metadata?.tags.map(tag => getAIVector(tag)));
            const results = await client.upsert("sections_hindi_vector", {
                points: vectors.map((vector, index) => ({
                    id: randomUUID(),
                    vector: vector,
                    payload: {
                        type: "tag",
                        tag: metadata.tags[index],
                        language: "hi",
                        section: parseInt(metadata.section)
                    }
                }))
            });
            return res.status(200).json({ message: "Tags saved successfully", results });
        } catch (error) {
            console.error("Error saving tags:", error);
            return res.status(500).json({ error: "Failed to save tags" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}