
import { connectDB } from "../../../../lib/db";
import Bnshi from "../../../../lib/schema/bnshi";



export default async function handler(req, res) {
    await connectDB()
    if (req.method === "GET") {

        const { id, page = 1, limit = 10, all } = req.query;

        if (id) {
            // Fetch specific section
            const bns = await Bnshi.findOne(
                { "sections.section": id.replace(".", "") },
                { "sections.$": 1 }
            ).lean();

            if (!bns) {
                return res.status(404).json({ error: "Section not found" });
            }
            return res.status(200).json({ bns });
        }

        try {
            const fetchAll = String(all || "").trim() === "1";
            let bns;

            if (fetchAll) {
                bns = await Bnshi.find({}, { _id: 1, sections: 1 }).lean();
            } else {
                const skip = (parseInt(page) - 1) * parseInt(limit);
                bns = await Bnshi.find({}, { _id: 1, sections: 1 })
                    .skip(skip)
                    .limit(parseInt(limit))
                    .lean();
            }
            return res.status(200).json({ bns });
        } catch (error) {
            return res.status(500).json({ error: "Server Error" });
        }
    }

    if (req.method === 'PUT') {
        const { content, id } = req.body;
        if (!content || !id) return res.status(400).json({ error: "Content and ID are required" });
        const newres = await Bnshi.updateOne(
            { "sections.section": id.replace(".", '') },
            { $set: { "sections.$.modify_section": content } },
        );
        return res.status(200).json({ success: true });
    }


}
