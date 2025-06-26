import client from "../../../lib/qdrant";

export default async function handler(req, res) {
    if (req.method == "GET") {
        // const sections=[]
        await getAllData().then(data => {
            // console.log('Fetched Data:', data);
            const sections = data.map(item => Number(item.payload.section)).sort((a, b) => a - b);
            return res.status(200).json({ searchResult:sections});

        });
    }

}

async function getAllData() {
    let allPoints = [];
    let offset = undefined;

    while (true) {
        const response = await client.scroll('sectionsvector', {
            limit: 100, // You can increase the limit if your server can handle more
            offset: offset,
        });

        allPoints = allPoints.concat(response.points);

        // If no more data, break the loop
        if (response.next_page_offset === null) {
            break;
        }

        // Prepare for the next batch
        offset = response.next_page_offset;
    }

    console.log('Total Points Fetched:', allPoints.length);
    return allPoints;
}

