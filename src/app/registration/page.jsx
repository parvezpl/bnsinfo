'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => router.push('/login'), 2000);
        } else {
            setMessage(data.message || 'Registration failed.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleRegister} className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />

                {message && <p className="text-center text-sm text-red-500">{message}</p>}

                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Register</button>
            </form>
        </div>
    );
}
