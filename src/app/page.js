
import Mainpage from "./mainpage";
import "./style.css";
export const metadata = {
  title: "BNS INFO",
  description: "POWERED BY HELIUSDEV",
  icons: {
    icon: '/favicon.ico',
  },

};
export default function Home() {
  return (
    <main>
      <Mainpage />
    </main>
  );
}
