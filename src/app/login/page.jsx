'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from './loginbutton';

export default function Page() {
    const [providers, setProviders] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    // const { data: session } = useSession();

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false, // We will manually handle redirection
            email,
            password,
        });

        if (result.ok) {
            router.push('/dashboard'); // Redirect to dashboard if success
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 ">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl ">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <LoginButton />
                <div className=' bg- '>hello</div>
                {/* Email/Password Login */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                        Login with Email
                    </button>
                </form>

                <div className="mt-6 border-t pt-4">
                    {providers && Object.values(providers).map((provider) => {
                        if (provider.id === 'credentials') return null;
                        return (
                            <div key={provider.name} className="mb-2">
                                <button
                                    onClick={() => signIn(provider.id)}
                                    className="w-full p-2 bg-gray-800 text-white rounded"
                                >
                                    Sign in with : {provider.name}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
