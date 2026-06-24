"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <div className={styles.profileCard}>
          <h2 className={styles.profileTitle}>Личный кабинет</h2>
          <div className={styles.userInfo}>
            <p><strong>Имя:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <button onClick={handleLogout} className={styles.btnLogout}>
            Выйти
          </button>
        </div>
      </main>

    </div>
  );
}