"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Используем те же стили

type SeatStatus = "free" | "selected" | "taken";

interface Seat {
  id: number;
  row: number;
  seatNumber: number;
  status: SeatStatus;
}

interface PerformanceData {
  title: string;
  date: string;
  time: string;
  hall: string;
  seanceId: number;
}

interface BookingMapProps {
  initialSeats: Seat[];
  performanceData: PerformanceData;
}

export default function BookingMap({ initialSeats, performanceData }: BookingMapProps) {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [limitWarning, setLimitWarning] = useState(false);
  const router = useRouter();

  const handleSeatClick = (index: number) => {
    const currentSeat = seats[index];
    if (currentSeat.status === "taken") return;

    const selectedCount = seats.filter((s) => s.status === "selected").length;

    if (currentSeat.status === "selected") {
      setSeats((prev) =>
        prev.map((seat, i) =>
          i === index ? { ...seat, status: "free" } : seat
        )
      );
      setLimitWarning(false);
    } else {
      if (selectedCount >= 4) {
        setLimitWarning(true);
        setTimeout(() => setLimitWarning(false), 3000);
      } else {
        setSeats((prev) =>
          prev.map((seat, i) =>
            i === index ? { ...seat, status: "selected" } : seat
          )
        );
        setLimitWarning(false);
      }
    }
  };

  const selectedCount = seats.filter((s) => s.status === "selected").length;
  
  // Группируем выбранные места по рядам для красивого вывода
  const selectedSeatsByRow = seats
    .filter((s) => s.status === "selected")
    .reduce((acc, curr) => {
      if (!acc[curr.row]) acc[curr.row] = [];
      acc[curr.row].push(curr.seatNumber);
      return acc;
    }, {} as Record<number, number[]>);

  const rowsDisplay = Object.entries(selectedSeatsByRow)
    .map(([row, nums]) => `${row} (${nums.join(", ")})`)
    .join("; ");

  const handleBookingClick = () => {
    const selected = seats
      .filter((s) => s.status === "selected")
      .map((s) => ({ row: s.row, seatNumber: s.seatNumber, id: s.id }));

    sessionStorage.setItem(
      "bookingData",
      JSON.stringify({
        performanceTitle: performanceData.title,
        date: performanceData.date,
        time: performanceData.time,
        hall: performanceData.hall,
        seanceId: performanceData.seanceId,
        selectedSeats: selected,
      })
    );

    router.push(`/performance/${performanceData.seanceId}/booking/confirm`);
  };

  // Группировка мест по рядам для отображения
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort((a, b) => a - b);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.seatMap}>
        <div className={styles.stage}>СЦЕНА</div>

        <div className={styles.sector}>
          <div className={styles.sectorLabel}>Партер</div>
          
          {rows.map((rowNum) => (
            <div key={rowNum} className={styles.row}>
              {seats
                .filter((s) => s.row === rowNum)
                .map((seat) => {
                   // Находим индекс в общем массиве для onClick
                   const globalIndex = seats.findIndex(s => s.id === seat.id);
                   return (
                    <div 
                      key={seat.id} 
                      className={`${styles.seat} ${styles[seat.status]}`}
                      onClick={() => handleSeatClick(globalIndex)}
                      title={`Ряд ${seat.row}, Место ${seat.seatNumber}`}
                    />
                   );
                })}
            </div>
          ))}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.free}`}></div>
            <span>Свободно</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.selected}`}></div>
            <span>Выбрано</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.taken}`}></div>
            <span>Занято</span>
          </div>
        </div>
      </div>

      {limitWarning && (
        <div className={styles.warningMessage}>
          Максимальное количество мест для бронирования — 4
        </div>
      )}

      <div className={styles.actionPanel}>
        <div className={styles.summary}>
          Выбрано мест: <span>{selectedCount}</span> <br />
          Ряды: {rowsDisplay || "—"}
        </div>
        <button 
          className={`${styles.btnBook} ${selectedCount === 0 ? styles.disabled : ''}`} 
          disabled={selectedCount === 0}
          onClick={handleBookingClick}
        >
          Перейти к оформлению
        </button>
      </div>
    </div>
  );
}