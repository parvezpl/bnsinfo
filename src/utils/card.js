export default async function fetchblog(params) {
  const res = await fetch("http://localhost:3000/api/blog");
  return res.json();
}