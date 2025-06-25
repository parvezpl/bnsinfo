import client from "../../../lib/qdrant";


export default async function handler(req, res) {
    if (req.method == "POST") {
        const {id} =req.body
        console.log("id", id)
        const mid=  qdrantIdToMongoId(id)
        console.log("mid", mid)
        const result = await client.retrieve('sectionsvector', {
            ids: id // Pass one or more point IDs this is an array
        });
        console.log('Retrieved points:', result);
        return res.status(200).json({ result });
    }

}


// Simple hash function to convert string to integer ID
function stringToIntId(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

// Create a mapping object
const mongoToQdrantMap = new Map();  // key: MongoID, value: QdrantID
const qdrantToMongoMap = new Map();  // key: QdrantID, value: MongoID

// Convert MongoDB ID to Qdrant ID and store mapping
function mongoIdToQdrantId(mongoId) {
    const qdrantId = stringToIntId(mongoId);

    // Store mapping
    mongoToQdrantMap.set(mongoId, qdrantId);
    qdrantToMongoMap.set(qdrantId, mongoId);

    return qdrantId;
}

// Retrieve MongoDB ID from Qdrant ID
function qdrantIdToMongoId(qdrantId) {
    console.log(qdrantId)
    return qdrantToMongoMap.get(qdrantId);
}