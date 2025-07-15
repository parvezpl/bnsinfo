import client from "../../../lib/qdrant";


export default async function handler(req, res) {
    if (req.method == "POST") {
        const { payloadId } = req.body
        console.log(payloadId)
        if (!payloadId) {
            return res.status(400).json({ error: "Missing payloadId in query" });
        }

        try {
            const scrollResult = await client.scroll('sections_hindi_vector', {
                limit: 1,
                filter: {
                    must: [
                        {
                            key: "section",           // This refers to payload.id
                            match: { value: payloadId },
                        }
                    ],
                },
                with_vector: false,
                with_payload: true,
            });

            if (scrollResult.points.length === 0) {
                return res.status(404).json({ error: "No match found for payload.id" });
            }

            return res.status(200).json({ result: scrollResult.points[0] });

        } catch (err) {
            console.error("Scroll failed:", err);
            return res.status(500).json({ error: "Internal server error", detail: err.message });
        }
    }
}


