// src/app/(public)/performance/[id]/booking/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/app/utils/prisma";
import BookingMap from "./BookingMap";
import styles from "./page.module.css"; // ✅ Добавьте импорт стилей!

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params;
  const performanceId = parseInt(id);

  // 1. Получаем данные о сеансе
  const seance = await prisma.seance.findUnique({
    where: { ID_seance: performanceId },
    include: {
      performance: true,
      hall: true,
    },
  });

  if (!seance) {
    return notFound();
  }

  // 2. Получаем все места зала с явной типизацией
  const seats = await prisma.seat.findMany({
    where: {
      ID_hall: seance.ID_hall,
    },
    select: {
      ID_key_seat: true,
      ID_row: true,
      ID_seat: true,
      seat_status_of: true,
    },
  });

  // 3. Получаем занятые места с явной типизацией
  const bookedSeats = await prisma.seat_by_ticket.findMany({
    where: {
      ticket: {
        ID_seance: seance.ID_seance,
      },
    },
    select: {
      ID_key_seat: true,
    },
  });

  // ✅ Явно указываем тип для s
  const bookedSeatIds = new Set(
    bookedSeats.map((s: { ID_key_seat: number }) => s.ID_key_seat)
  );

  // ✅ Явно указываем тип для seat
  const formattedSeats = seats.map((seat: {
  ID_key_seat: number;
  ID_row: number | null;
  ID_seat: number | null;
  seat_status_of: number;
}) => ({
  id: seat.ID_key_seat,
  row: seat.ID_row || 0,
  seatNumber: seat.ID_seat || 0,
  // ✅ Исправление: as const предотвращает расширение до string
  status: bookedSeatIds.has(seat.ID_key_seat) ? ("taken" as const) : ("free" as const),
}));

  return (
    <div className={styles.container}> {/* ✅ Используем styles */}
      <main className={styles.main}>
        <div className={styles.performanceCard}>
          <h2 className={styles.performanceCardTitle}>{seance.performance.performance_name}</h2>
          
          <div className={styles.performanceInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoItemLabel}>Дата</div>
              <div className={styles.infoItemValue}>
                {new Date(seance.seance_date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemLabel}>Время</div>
              <div className={styles.infoItemValue}>
                {seance.seance_time?.toString().slice(0, 5)}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemLabel}>Место</div>
              <div className={styles.infoItemValue}>{seance.hall.hall_address}</div>
            </div>
          </div>
            <BookingMap 
            initialSeats={formattedSeats}
            performanceData={{
              title: seance.performance.performance_name,
              date: new Date(seance.seance_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
              time: seance.seance_time?.toString().slice(0, 5) || "",
              hall: seance.hall.hall_address,
              seanceId: seance.ID_seance,
            }}
          />
          
        </div>
      </main>
    </div>
  );
}