import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href="/контакты" className={styles.link}>Контакты</Link>
        <Link href="/документы" className={styles.link}>Документы</Link>
      </div>
      <a href="https://vk.com/theater_satire_ogu" className={styles.social}>
        наша группа в вк
      </a>
    </footer>
  );
}