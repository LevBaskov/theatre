"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

// 🔐 Костыль: жёстко заданные логин и пароль
const MOCK_USER = {
  email: "user1@mail.ru",
  password: "123456",
  name: "Пользователь1",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Простая проверка "костылём"
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      // Сохраняем "авторизованного" пользователя в localStorage (для имитации сессии)
      localStorage.setItem("user", JSON.stringify(MOCK_USER));
      router.push("/"); // Переход в профиль
    } else {
      setError("Неверный email или пароль");
    }
  };

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Вход в личный кабинет</h2>
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.btnLogin}>
              Войти
            </button>
          </form>

          <div className={styles.registerSection}>
            <p>Нет аккаунта?</p>
            <Link href="/register" className={styles.btnRegister}>
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </main>

     
    </div>
  );
}