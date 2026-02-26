import SessionProviderWrapper from "../SessionProviderWrapper";

export default function RootLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <div className="flex h-full flex-col bg-gray-100 text-gray-950">
        {children}
      </div>
    </SessionProviderWrapper>
  );
}
