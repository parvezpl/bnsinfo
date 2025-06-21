import { connectDB } from "../../../lib/db";
import Bnsenglishs from "../../../lib/schema/bnsen";
import Bnshindis from "../../../lib/schema/bnshi";

let data = []
export default async function handler(req, res) {
    await connectDB()

    if (req.method == "GET") {

        const { search, lang } = req.query
        const searchterm = search.split(" ")
        try {
            if (lang === "hi") {
                const bns = await Bnshindis.find({
                    $text: { $search: search }
                }).lean();
                
                console.log("BNS Hindi Search Result Count:", bns, search);
                returnSearchText(bns, searchterm, res);

                // return res.status(200).json({ ...responce });
            } else {
                const bns = await Bnsenglishs.find({
                    $text: { $search: search }
                }).lean();
                returnSearchText(bns, searchterm, res);
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error fetching data' });
        }

    }

}


function returnSearchText(responce, searchterm, res) {
    const data = responce.map(item => {
        return item.sections?.filter(resx => {
            let isMatch = false;
            searchterm.forEach(term => {
                // console.log("searchterm:", term.length, "responce:", resx.section.length, resx.section.replace(".", ""));
                if (term.trim() === resx.section.trim().replace(".", "")) {
                    isMatch = true;
                }
                if (resx?.section_title?.trim().toLowerCase().includes(term.trim().toLowerCase())) {
                    isMatch = true;
                }
                if (resx?.section_content?.trim().toLowerCase().includes(term.trim().toLowerCase())) {
                    isMatch = true;
                }

            })
            if (isMatch) {
                return true;
            }
        });
    })[0];

    if (data?.length === 0 || data === undefined || data === null) {
        return res.status(404).json({ error: "No matching sections found" });
    }
    const filteredData = data?.filter(item => item !== undefined && item !== null);
    // console.log("Filtered Data:",  data);
    return res.status(200).json({ bns: filteredData || [] });
}