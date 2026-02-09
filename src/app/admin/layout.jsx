import Sidebar from "./sidebar";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import styles from "./admin.module.css";

export default async function RootLayout({ children }) {
  const session = await getAuthSession();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <div className={styles.adminShell}>
      <Sidebar />
      <div className={styles.adminContent}>{children}</div>
    </div>
  );
}
