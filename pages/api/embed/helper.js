import client from '../../../lib/qdrant';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await client.getCollections();
            console.log('List of collections:', result.collections);
            return res.status(200).json({ collections: result.collections });
        } catch (err) {
            console.error('Could not get collections:', err);
            return res.status(500).json({ error: 'Failed to fetch collections' });
        }
    }

    if (req.method === 'POST') {
        const { id, vector, payload } = req.body;
        // console.log(id)
        const qdrantId =mongoIdToQdrantId(id);
        console.log(qdrantId )
        try {
            const result = client.upsert('sectionsvector', {
                points: [
                    {
                        id: qdrantId,
                        vector: vector,       // Array of floats
                        payload: payload
                    },
                ],
            });

            return res.status(200).json({ message: 'Data inserted successfully', result, state:true });
        } catch (err) {
            console.error('Could not insert data:', err);
            return res.status(500).json({ error: 'Failed to insert data' });
        }
    }


    if (req.method === 'PUT') {
        try {
            const result = await client.createCollection('sectionsvector', {
                vectors: {
                    size: 384, // embedding vector size (example)
                    distance: 'Cosine',
                },
            });
            return res.status(200).json({ message: 'Collection created successfully', result });
        } catch (err) {
            console.error('Could not create collection:', err);
            return res.status(500).json({ error: 'Failed to create collection' });
        }
    }

    // If method is not GET, POST, or PUT
    return res.status(405).json({ error: 'Method not allowed' });
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
export function mongoIdToQdrantId(mongoId) {
    const qdrantId = stringToIntId(mongoId);

    // Store mapping
    mongoToQdrantMap.set(mongoId, qdrantId);
    qdrantToMongoMap.set(qdrantId, mongoId);

    return qdrantId;
}

// Retrieve MongoDB ID from Qdrant ID
export function qdrantIdToMongoId(qdrantId) {
    console.log(qdrantId)
    return qdrantToMongoMap.get(qdrantId);
}
