import Image from "next/image";
import BnsHome from "./bns/bnshome";
export default function Home() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-items-center pb-20 text-black  font-[family-name:var(--font-geist-sans)]">
      {/* <nav className=" flex w-full h-full row-start-1 bg-gray-400">
        hello
      </nav> */}
      <main className="flex-grow w-screen ">
        <BnsHome />
      </main>
      <footer className=" h-[20px gap-[24px] flex flex-wrap items-center justify-center bor">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.heliusdev.in/bns"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.heliusdev.in/bns"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          contribute
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.heliusdev.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to heliusdev →
        </a>
      </footer>
    </div>
  );
}
