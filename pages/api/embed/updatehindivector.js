import client from '../../../lib/qdrant';
// import { mongoIdToQdrantId } from './helper';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const { section, vector, payload } = req.body;
        console.log("section", section)
        try {
            // Step 1: Find the point by payload.section
            const scrollResult = await client.scroll('sections_hindi_vector', {
                limit: 1,
                filter: {
                    must: [
                        {
                            key: 'section',  // payload key
                            match: {
                                value: 1  // the section you want to update, e.g. 323
                            }
                        }
                    ]
                }
            });
            console.log('scrollResult', scrollResult)
            const found = scrollResult.points?.[0];
            if (!found) {
                return res.status(404).json({ message: 'Point not found for this section' });
            }

            // const pointId = found.id;

            // // Step 2: Update vector
            // await client.updateVectors('sections_hindi_vector', {
            //     points: [
            //         {
            //             id: pointId,
            //             vector: vector
            //         }
            //     ]
            // });

            // // Step 3: Update payload
            // await client.setPayload('sections_hindi_vector', {
            //     payload: payload,
            //     points: [pointId]
            // });

            // return res.status(200).json({
            //     message: `Point for section ${section} updated successfully`,
            //     pointId,
            //     state: true
            // });

        } catch (err) {
            console.error('Update failed:', err);
            return res.status(500).json({ error: 'Failed to update point' });
        }
    }

}





