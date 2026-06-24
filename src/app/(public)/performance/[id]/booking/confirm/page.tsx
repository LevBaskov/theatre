"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

type Seat = { row: number; seatNumber: number };
type BookingData = {
  performanceTitle: string;
  date: string;
  time: string;
  hall: string;
  selectedSeats: Seat[];
};

export default function ConfirmPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState<BookingData>({
    performanceTitle: "Загрузка...",
    date: "",
    time: "",
    hall: "",
    selectedSeats: [],
  });
  
  const router = useRouter();

  // Загружаем данные, переданные с предыдущей страницы
  useEffect(() => {
    const saved = sessionStorage.getItem("bookingData");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      // Если данные не переданы, возвращаем на выбор мест
      router.push("/"); 
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    setIsSubmitted(true);
    sessionStorage.removeItem("bookingData"); // Очищаем хранилище после успешной брони
    // setTimeout(() => {
    //   router.push("/");
    // }, 1000);
  };

  // Форматируем места для красивого вывода: "Ряд 1: Места 4, 5; Ряд 2: Место 2"
  const formattedSeats = data.selectedSeats
    .reduce((acc, curr) => {
      if (!acc[curr.row]) acc[curr.row] = [];
      acc[curr.row].push(curr.seatNumber);
      return acc;
    }, {} as Record<number, number[]>);

  const seatsDisplay = Object.entries(formattedSeats)
    .map(([row, nums]) => `Ряд ${row}: Места ${nums.join(", ")}`)
    .join("; ");

  if (isSubmitted) {
    return (
      <main className={styles.main}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Бронирование подтверждено!</h2>
          <p className={styles.successText}>
            Электронный билет отправлен на <strong>{email}</strong>
          </p>
          <Link href="/" className={styles.backLink}>
            Вернуться на главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.confirmCard}>
        <h2 className={styles.cardTitle}>Оформление бронирования</h2>
        
        <div className={styles.formGrid}>
          {/* Левая колонка: Данные пользователя */}
          <div className={styles.userData}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Введите email</label>
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
              <label htmlFor="name">Введите ФИО</label>
              <input
                id="name"
                type="text"
                placeholder="Введите ФИО"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Правая колонка: Предпросмотр билета */}
          <div className={styles.ticketPreview}>
            <h3 className={styles.previewTitle}>Предварительный просмотр билета</h3>
            <div className={styles.ticketMockup}>
              <div className={styles.ticketHeader}>
                <span className={styles.ticketTheater}>Театр Сатиры</span>
                <span className={styles.ticketStatus}>Бесплатный вход</span>
              </div>
              <div className={styles.ticketBody}>
                <h4 className={styles.ticketShow}>{data.performanceTitle}</h4>
                <div className={styles.ticketInfo}>
                  <p>{data.date}</p>
                  <p> {data.time}</p>
                  <p>{data.hall}</p>
                </div>
                <div className={styles.ticketSeats}>
                  {data.selectedSeats.length > 0 ? seatsDisplay : "Места не выбраны"}
                </div>
              </div>
              <div className={styles.ticketFooter}>
                {/* Цена убрана, оставлен только QR-код */}
                <div className={styles.qrCode}>
                  <div className={styles.qrPattern}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.btnConfirm}>
          Подтвердить
        </button>
      </form>
    </main>
  );
}