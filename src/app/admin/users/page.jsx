import { UsersTable } from "./userstable";
import styles from "./page.module.css";

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
    <div className={styles.page}>
      <h1 className={styles.title}>All Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
