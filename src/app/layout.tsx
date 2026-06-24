import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Молодежная студия Театра Сатиры имени И.С. Тургенева",
  description: "Система бронирования билетов на спектакли",
};

export default function RootLayout({
  children,}: {  children: React.ReactNode;}) 
  {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}