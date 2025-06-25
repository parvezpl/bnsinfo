import client from "../../../lib/qdrant";


export default async function handler(req, res) {
    if (req.method == "POST") {
        const { vector } = req.body
        const searchResult = await client.search('sections_hindi_vector', {
            vector: vector,
            limit: 5
        });

        console.log('Search result:', searchResult);
        return res.status(200).json({ searchResult });
    }

}