import { connectDB } from "../../../lib/db";
import Bnsenglishs from "../../../lib/schema/bnsen";
import Bnshindis from "../../../lib/schema/bnshi";

let data = []
export default async function handler(req, res) {
     await connectDB()

    if (req.method == "GET") {
        // await Bnsenglishs.syncIndexes()

        const { search, lang } = req.query
        console.log("value search",search, lang)
        try {
            if (lang==="hi") {
                const bns = await Bnshindis.find({
                    $text: { $search: search }
                }).lean();
                return res.status(200).json(bns);
            } else {
                const bns = await Bnsenglishs.find({
                    $text: { $search: search }
                }).lean();
                return res.status(200).json(bns);
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error fetching data' });
        }

    }

}