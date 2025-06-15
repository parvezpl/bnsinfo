import { connectDB } from "../../../lib/db";
import Bnsengishmodel from "../../../lib/schema/bnsmodel";
// import sectionEmbeddings from './section_embeddings.json';
// import legalSections from './legal_sections.json';
import { pipeline } from '@xenova/transformers';


let data = []
export default async function handler(req, res) {
    await connectDB()
    console.log("hello")

    if (req.method == "GET") {
        const { search } = req.query
        const enbdata = await Bnsengishmodel.find()

        enbdata?.map( async (ress) => {
            const plainObject = ress.toObject();
            console.log(Object.keys(plainObject))
            console.log(typeof(Array(plainObject.section_embeddings)))
            const sectionEmbeddings= plainObject.section_embeddings
            const legalSections= plainObject.sections

            const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            const query = 'He threatened to kill his neighbor over a property dispute';
            const queryEmbedding = (await model(query)).data[0];
            function cosineSimilarity(a, b) {
                const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
                const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
                const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
                return dot / (normA * normB);
            }

            const scores = sectionEmbeddings.map((emb) => cosineSimilarity(queryEmbedding, emb));
            const bestIdx = scores.indexOf(Math.max(...scores));
            const bestMatch = legalSections[bestIdx];
            console.log(`✅ Suggested: ${bestMatch.section} - ${bestMatch.title}`);
            console.log(`📘 Description: ${bestMatch.content}`);
            res.status(200).json({ Suggested: bestMatch.section, title: bestMatch.title, content:content  });

        })

        // try {


        // } catch (error) {
        //     console.log(error)
        //     res.status(500).json({ error: 'Error fetching data' });
        // }

    }

}