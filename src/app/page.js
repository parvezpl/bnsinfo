import Image from "next/image";
import Navigation from "./utlty/navigation";
import Mainpage from "./mainpage";
export const metadata = {
  title: "BNS INFO",
  description: "POWERED BY HELIUSDEV",
};
export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-items-center text-black  font-[family-name:var(--font-geist-sans)] ">
      <main className="relative flex-grow w-screen box-border  ">
        <Mainpage/>
      </main>
    </div>
  );
}
