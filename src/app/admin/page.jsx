import React from "react";
import styles from "./admin.module.css";

export default function Page() {
  return (
    <div className={styles.adminPage}>
      <h1 className={styles.adminTitle}>Admin Dashboard</h1>
      <p className={styles.adminText}>Welcome to the admin panel.</p>
    </div>
  );
}
