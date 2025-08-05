// app/admin/users/page.tsx

import { UsersTable } from "./userstable";


async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/users`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function AdminUsersPage() {
  const users = await fetchUsers();

  return (
    <div className="min-h-screen w-screen px-6 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">All Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
