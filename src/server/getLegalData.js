// server/getLegalData.js

export async function getLegalData() {
  const data = await fetch(`/api/bns/bnsen`)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching legal data:", err);
      return [];
    });
    console.log("Fetched legal data:", data);
  return JSON.parse(JSON.stringify(data));
}
