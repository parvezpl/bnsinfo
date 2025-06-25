
import client from '../../../lib/qdrant'

export default async function handler(req, res) {

    if (req.method == 'GET') {
        const searchResult = await client.search("section_content", {
          vector: [0.12, 0.15, 0.9],
          limit: 5,
        });
        res.status(200).json({searchResult});
    }

}


