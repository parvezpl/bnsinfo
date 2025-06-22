
import { connectDB } from "../../../../lib/db";
import Bnsen from "../../../../lib/schema/bnsen";



export default async function handler(req, res) {
    await connectDB()

    if (req.method == "GET") {
        const { id } = req.query
        if (id) {
            const bns = await Bnsen.findOne(
                { "sections.section": id.replace(".", '') },  // Match document where section 196 exists
                { "sections.$": 1 }
            ).lean();
            if (!bns) {
                return res.status(404).json({ error: "Section not found" });
            }
            return res.status(200).json({ bns });
        }
        const bns = await Bnsen.find()
        return res.status(200).json({ bns });
    }

    if (req.method === 'PUT') {
        const { content, id } = req.body;
        if (!content || !id) return res.status(400).json({ error: "Content and ID are required" });
        const newres=await Bnsen.updateOne(
            { "sections.section": id.replace(".", '') },
            { $set: { "sections.$.modify_section":content } },
        );
        return res.status(200).json({ success: true });
    }


}



// const newres=await Bnsen.updateMany(
//              { "sections.modify_section": { $exists: false } },
//             {
//     $set: {
//       "sections.$[].modify_section": "" // add field with empty string
//     }