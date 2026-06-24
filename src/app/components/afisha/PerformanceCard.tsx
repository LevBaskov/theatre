import styles from "./PerformanceCard.module.css";
import Link from "next/link";
interface PerformanceCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  id: string;
}

export default function PerformanceCard({
  title,
  date,
  time,
  location,
  description,
  id,
}: PerformanceCardProps) {
  return (
    <Link href={`/performance/${id}`} className={styles.cardLink}>
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.detail}>{date}, {time}</span>
        <span className={styles.detail}>{location}</span>
      </div>
      <div className={styles.image}>Афиша</div>
      <div className={styles.description}>{description}</div>
    </div>
    </Link>
  );
}