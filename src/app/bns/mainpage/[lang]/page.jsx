import Mainpage from './mainpage';
import { getBnsData } from './fetchData';

export default async function LangMainPage(props) {
  const { params, searchParams } = await props;
  const lang = params?.lang;
  const currentPage = parseInt((searchParams?.page ?? '1'), 10);

  const result = await getBnsData(lang, currentPage);

  return (
    <Mainpage result={result} currentPage={currentPage} lang={lang} />
  );
}

