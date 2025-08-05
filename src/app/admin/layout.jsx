
import Sidebar from "./sidebar";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

export default async function RootLayout({ children }) {
    const session = await getAuthSession();
    // console.log(session);
    if (!session || session.user.role !== 'admin') {
        redirect('/');
    }
    return (
        <div className="flex h-full flex-row bg-gray-100  text-gray-950">
            <Sidebar />
            {children}
        </div>
    );
}
