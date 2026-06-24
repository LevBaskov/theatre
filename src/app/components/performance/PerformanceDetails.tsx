// src/components/performance/PerformanceDetails.tsx
import styles from "./PerformanceDetails.module.css";
import Link from "next/link";
interface PerformanceProps {
  title: string;
  genre: string;
  director: string;
  actors: string[];
  description: string;
}

export default function PerformanceDetails({
  title,
  genre,
  director,
  actors,
  description,
}: PerformanceProps) {
  return (
    <div className={styles.container}>
      {/* Заголовок с постером */}
      <header className={styles.header}>
        <div className={styles.poster}>АФИША СПЕКТАКЛЯ</div>
        
        <div className={styles.infoBlock}>
          <h1 className={styles.title}>{title}</h1>
          
          <div className={styles.metaTags}>
            <span className={`${styles.tag} ${styles.tagHighlight}`}>{genre}</span>
            <span className={styles.tag}>1 час 20 мин</span>
            <span className={styles.tag}>16+</span>
          </div>

          <p className={styles.description}>{description}</p>
        </div>
      </header>

      {/* Блок создателей */}
      <div className={styles.crewSection}>
        {/* Режиссер */}
        <div className={styles.crewColumn}>
          <h3 className={styles.columnTitle}>Режиссёр-постановщик</h3>
          <p className={styles.personName}>{director}</p>
        </div>

        {/* Актеры */}
        <div className={styles.crewColumn}>
          <h3 className={styles.columnTitle}>В ролях</h3>
          {actors.map((actor, index) => (
            <p key={index} className={styles.personName}>• {actor}</p>
          ))}
        </div>
      </div>

      
    </div>
  );
}