// src/components/afisha/AfishaSearch.tsx
"use client";

import { useState } from "react";
import styles from "./AfishaSearch.module.css";

interface AfishaSearchProps {
  onSearch: (term: string) => void; // Функция, которую вызовет поиск
}

export default function AfishaSearch({ onSearch }: AfishaSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Сразу передаем значение наверх
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className={styles.input}
          placeholder="Введите название спектакля..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className={styles.button} aria-label="Поиск">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </form>
    </div>
  );
}