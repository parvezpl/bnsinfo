export default async function fetchblog(params) {
  const res = await fetch(`${process.env.WEBHOST}/api/blog`|| `http://bnsinfo.in/api/blog`);
  return res.json();
}