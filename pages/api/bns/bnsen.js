
import { connectDB } from "../../../lib/db";
import Bnsen from "../../../lib/schema/bnsen";



export default async function handler(req, res) {
    await connectDB()

    if (req.method == "GET") {
        const { id } = req.query
        console.log("Request ID:", id);
        if (id) {
            const bns = await Bnsen.findOne(
                { "sections.section": id },  // Match document where section 196 exists
                { "sections.$": 1 }
            ).lean();
            if (!bns) {
                return res.status(404).json({ error: "Section not found" });
            }
            res.status(200).json({ bns });
        }
        const bns = await Bnsen.find()
        return res.status(200).json({ bns });
    }

    if (req.method === 'PUT') {
        const { content, id } = req.body;
        await collection.updateOne(
            { sectionId: id },
            { $set: { content } },
            { upsert: true }
        );
        return res.status(200).json({ success: true });
    }


}
