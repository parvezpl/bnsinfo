export async function getBnsData(lang, page) {
  const limit = 4;
  const url =
    lang === 'en'
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/bns/bnsenglish/bnsen?page=${page}&limit=${limit}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/bns/bnshindi/bnshi?page=${page}&limit=${limit}`;

  const response = await fetch(url, { cache: 'no-store' });
  return await response.json();
}
