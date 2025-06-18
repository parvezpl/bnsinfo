import { connectDB } from "../../../lib/db";
import Bnsenglishs from "../../../lib/schema/bnsen";
import Bnshindis from "../../../lib/schema/bnshi";

let data = []
export default async function handler(req, res) {
    await connectDB()

    if (req.method == "GET") {

        const { search, lang } = req.query
        // console.log("Search query:", search, "Language:", lang);

        try {
            if ("en" === "hi") {
                const bns = await Bnshindis.find({
                    $text: { $search: search }
                }).lean();

                const data= bns.map(item => {
                    return item.sections?.filter(res=>{
                        if ( search.trim().toLowerCase() === res.section.trim().toLowerCase()) {
                            return res.section;
                        }
                    })[0];
                });
                // console.log("Filtered sections:", search, data);

                if (bns.length === 0) {
                    return res.status(404).json({ error: "No matching sections found" });
                }
                const filteredData = data.filter(item => item !== undefined && item !== null);
                return res.status(200).json({bns:filteredData});


            } else {
                const bns = await Bnsenglishs.find({
                    $text: { $search: search }
                }).lean();
                console.log("Search results:", bns);
                const data= bns.map(item => {
                    return item.sections?.filter(res=>{
                        if ( search.trim().toLowerCase() === res.section.trim().toLowerCase()) {
                            return res.section;
                        }
                    })[0];

                });
                // console.log("Filtered sections:", search, data);

                if (bns.length === 0) {
                    return res.status(404).json({ error: "No matching sections found" });
                }




                const filteredData = data.filter(item => item !== undefined && item !== null);
                return res.status(200).json({bns:filteredData});
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error fetching data' });
        }

    }

}