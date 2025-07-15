import client from "../../../lib/qdrant";

export default async function handler(req, res) {

    getAllData("sections_hindi_vector")
        .then((points) => {
            console.log("Total points:", points.length);
            console.log("Sample point:", points[0]);
            res.status(500).json({data:points[0]})
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
        });


    async function getAllData(collectionName) {
        let allPoints = [];
        let offset = undefined;
        const limit = 1000;

        while (true) {
            const response = await client.scroll(collectionName, {
                limit,
                with_payload: true,
                with_vector: false,
                offset,
            });

            const { points, next_page_offset } = response;

            allPoints.push(...points);

            if (!next_page_offset) break;

            offset = next_page_offset;
        }

        return allPoints;
    }
}

