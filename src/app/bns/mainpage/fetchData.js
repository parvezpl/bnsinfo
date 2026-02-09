export async function getBnsData(page) {
  const limit = 4;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bns/bnshindi/bnshi?page=${page}&limit=${limit}`;

  const response = await fetch(url, { cache: 'no-store' });
  return await response.json();
}
