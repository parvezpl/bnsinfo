import client from "../../../lib/qdrant";


export default async function handler(req, res) {
    if (req.method == "POST") {
        const { vector, lang } = req.body
        const searchResult = await client.search(lang ==="hi" ? 'sections_hindi_vector' : "sectionsvector" , {
            vector: vector,
            limit: 5
        });
        return res.status(200).json({ searchResult });
    }

}