"use client";
import { useState } from "react";

export function UsersTable({ users }) {
    const [query, setQuery] = useState("");

    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase()) ||
            user.role?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Email</th>
                            <th className="text-left px-4 py-3">Role</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, i) => (
                            <tr
                                key={user._id || i}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 font-medium">{user.name}</td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3 capitalize">{user.role}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full font-semibold ${user.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {user.isPaid ? "Paid" : "Free"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
