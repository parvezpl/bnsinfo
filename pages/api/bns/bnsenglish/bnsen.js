
import { connectDB } from "../../../../lib/db";
import Bnsen from "../../../../lib/schema/bnsen";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        const { id, page = 1, limit = 4 } = req.query;

        if (id) {
            try {
                const bns = await Bnsen.findOne(
                    { "sections.section": id.replace(".", '') },
                    { "sections.$": 1 }
                ).lean();

                if (!bns) {
                    return res.status(404).json({ error: "Section not found" });
                }
                return res.status(200).json({ bns });
            } catch (error) {
                return res.status(500).json({ error: "Server Error" });
            }
        }
        try {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const bns = await Bnsen.find({}, { _id: 1, sections: 1 })
                .sort({ _id: 1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean();
            return res.status(200).json({ bns });
        } catch (error) {
            return res.status(500).json({ error: "Server Error" });
        }
    }
    if (req.method === 'PUT') {
        const { content, id } = req.body;
        console.log(content, id)
        if (!content || !id) return res.status(400).json({ error: "Content and ID are required" });
        const newres = await Bnsen.updateOne(
            { "sections.section": id.replace(".", '') },
            { $set: { "sections.$.modify_section": content } },
        );
        return res.status(200).json({ status: newres });
    }
}


