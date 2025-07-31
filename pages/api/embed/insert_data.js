import client from '../../../lib/qdrant';
import { getAIVector } from './multilang_vector';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id, payload } = req.body;
        console.log(id)
        const vector = await getAIVector(payload.text);
        const qdrantId =mongoIdToQdrantId(id);
        console.log(qdrantId )
        try {
            const result = client.upsert('vecter_test', {
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
