import { connectDB } from "../../../lib/db";
import Bnsengishmodel from "../../../lib/schema/bnsmodel";
import { pipeline } from '@xenova/transformers';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        const { search } = req.query;

        try {
            // Load model once
            const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            const query = search || 'He threatened to kill his neighbor over a property dispute';
            const queryEmbedding = (await model(query)).data[0];

            function cosineSimilarity(a, b) {
                const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
                const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
                const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
                return dot / (normA * normB);
            }

            const enbdata = await Bnsengishmodel.find();
            let bestScore = -Infinity;
            let bestMatch = null;

            for (const item of enbdata) {
                const plainObject = item.toObject();
                const sectionEmbeddings = plainObject.section_embeddings;
                const legalSections = plainObject.sections;

                sectionEmbeddings.forEach((emb, idx) => {
                    const score = cosineSimilarity(queryEmbedding, emb);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = legalSections[idx];
                    }
                });
            }

            if (bestMatch) {
                console.log(`✅ Suggested: ${bestMatch.section} - ${bestMatch.title}`);
                console.log(`📘 Description: ${bestMatch.content}`);
                res.status(200).json({
                    section: bestMatch.section,
                    title: bestMatch.title,
                    content: bestMatch.content,
                    score: bestScore.toFixed(4),
                });
            } else {
                res.status(404).json({ message: "No match found" });
            }
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
