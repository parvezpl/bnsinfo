import Mainpage from './mainpage';
import { getBnsData } from './fetchData';

export default async function LangMainPage({ params, searchParams }) {
  const lang = params.lang;
  const currentPage = parseInt(searchParams?.page || '1');

  const result = await getBnsData(lang, currentPage);

  return (
    <Mainpage result={result} currentPage={currentPage} lang={lang} />
  );
}

