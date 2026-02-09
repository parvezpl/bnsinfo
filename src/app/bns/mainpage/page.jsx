import Mainpage from './mainpage';
import { getBnsData } from './fetchData';

export default async function Page(props) {
  const { searchParams } = props;
  const { page } = await searchParams;
  const currentPage = parseInt((page ?? '1'), 10);

  const result = await getBnsData(currentPage);

  return (
    <Mainpage result={result} currentPage={currentPage} />
  );
}
