import Sidebar from "./sidebar";

export default function RootLayout({ children }) {
    return (
        <div className="flex h-full flex-row bg-gray-100  text-gray-950">
            <Sidebar />
            {children}
        </div>
    );
}
