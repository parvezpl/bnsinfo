import {QdrantClient} from '@qdrant/js-client-rest';

const client = new QdrantClient({
    url: 'https://586300d7-9fbb-46c3-9272-d0b215fba640.us-west-1-0.aws.cloud.qdrant.io:6333',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.Ql0HUlcOU1NFRQMs2qBbWJGHVa6NZe211Fg8K8mkJ8I',
});

try {
    const result = await client.getCollections();
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}


// await client.recreateCollection("my_collection", {
//   vectors: {
//     size: 384, // size of your embedding vector
//     distance: "Cosine",
//   },
// });


// await client.upsert("my_collection", {
//   points: [
//     {
//       id: 1,
//       vector: [0.12, 0.15, 0.9, ...], // your embedding vector
//       payload: { text: "This is a test sentence" },
//     },
//   ],
// });


// const searchResult = await client.search("my_collection", {
//   vector: [0.12, 0.15, 0.9, ...], // your query embedding
//   limit: 5,
// });

// console.log(searchResult);
