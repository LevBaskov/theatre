import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        Молодежная студия Театра Сатиры имени И.С. Тургенева
      </h1>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Репертуар</Link>
        <Link href="/о-театре" className={styles.navLink}>О театре</Link>
        <Link href="/profile" className={styles.navLink}>Войти</Link>
      </nav>
    </header>
  );
}