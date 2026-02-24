import Mainpage from './mainpage';
import { getBnsData } from './fetchData';

export const metadata = {
  title: 'BNS Mainpage | BNS Info',
  description: 'Browse Bharatiya Nyaya Sanhita 2023 sections with searchable, structured content.',
};

export default async function Page(props) {
  const { searchParams } = props;
  const { page, section } = await searchParams;
  const currentPage = parseInt((page ?? '1'), 10);
  const initialSection =
    typeof section === 'string' && section.trim() ? section.trim() : null;

  const result = await getBnsData(currentPage);

  return (
    <Mainpage
      result={result}
      currentPage={currentPage}
      initialSection={initialSection}
    />
  );
}
