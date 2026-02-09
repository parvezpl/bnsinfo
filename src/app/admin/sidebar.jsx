import Link from "next/link";
import React from "react";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h2 className={styles.title}>Admin Sidebar</h2>
        <p className={styles.subtitle}>BNSINFO नियंत्रण</p>
      </div>
      <nav className={styles.nav}>
        <Link href="/admin/blog" className={styles.link}>Write blogs</Link>
        <Link href="/admin/users" className={styles.link}>Manage Users</Link>
        <Link href="/admin/bns" className={styles.link}>Add BNS</Link>
      </nav>
    </aside>
  );
}
