// app/dashboard/page.js

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-">
            <h1 className="text-3xl font-bold mb-4">Welcome {session?.user?.name}</h1>
            <button
                onClick={() => signOut()}
                className="p-2 bg-red-500 text-white rounded"
            >
                Sign Out
            </button>
        </div>
    );
}
