export async function getBnsData(page) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bns/bnshindi/bnshi?all=1`;

  const response = await fetch(url, { cache: 'no-store' });
  return await response.json();
}
