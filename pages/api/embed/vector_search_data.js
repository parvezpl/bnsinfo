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
            if (!Array.isArray(vector) || vector.length === 0) {
                return res.status(400).json({ error: "Generated vector is invalid" });
            }
            console.log("Received text for vector search:", text, vector);

            const collectionName = process.env.QDRANT_COLLECTION || "sections_hindi_vector";
            const searchResult = await client.search(collectionName, {
                vector: vector,
                limit: 5,
                with_payload: true,
            });
            console.log("Raw search results from Qdrant:", searchResult);
            const host = req.headers.host;
            const proto = req.headers["x-forwarded-proto"] || "http";
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");
            const response = await Promise.all(searchResult.map(async (item) => {
                const section = item?.payload?.section;
                if (!baseUrl || section == null) {
                    return item;
                }
                const fetchRes = await fetch(
                    `${baseUrl}/api/bns/bnshindi/sections?search=${encodeURIComponent(section)}`,
                    { cache: "no-store" }
                );
                if (!fetchRes.ok) {
                    console.error("Section fetch failed:", fetchRes.status, fetchRes.statusText);
                    return item;
                }
                const resdata = await fetchRes.json();
                console.log("resdata", resdata);
                if (resdata?.sections) {
                    item.payload = resdata.sections;
                }
                return item;
            }));

            return res.status(200).json({ searchResult: response });

        } catch (error) {
            const status = error?.status || error?.response?.status;
            if (status === 404 || String(error?.message || "").includes("Not Found")) {
                return res.status(500).json({
                    error: "Qdrant collection not found",
                    details: `Collection '${process.env.QDRANT_COLLECTION || "sections_hindi_vector"}' not found. Check QDRANT_COLLECTION or create the collection in Qdrant.`,
                });
            }
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
