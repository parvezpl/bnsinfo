const { default: client } = require("../../../lib/qdrant");

export default async function listAllPoints() {
    let offset = null;
    let hasMore = true;

    while (hasMore) {
        const result = await client.scroll('sectionsvector', {
            offset,
            limit: 10 // how many points to fetch per request
        });

        console.log('Fetched points:', result.points);

        if (result.next_page_offset) {
            offset = result.next_page_offset;
        } else {
            hasMore = false;
        }
    }
}


export async function qdrent_data_by_id(id) {
    const result = await client.retrieve('sectionsvector', {
        ids: id // Pass one or more point IDs
    });
    console.log('Retrieved points:', result);
    return result
}


export async function qdrent_data_by_vector(vector) {
    const searchResult = await client.search('sectionsvector', {
        vector: vector, 
        limit: 5 
    });

    console.log('Search result:', searchResult);
    return searchResult


}