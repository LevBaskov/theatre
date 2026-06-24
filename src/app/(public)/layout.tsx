import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/layout/header";
import Footer from "@/app/components/layout/footer";

export const metadata: Metadata = {
  title: "Молодежная студия Театра Сатиры имени И.С. Тургенева",
  description: "Система бронирования билетов на спектакли",
};

export default function RootLayout({
  children,}: {  children: React.ReactNode;}) 
  {
  return (
    <html lang="ru">
      <body>
      <Header/>

      {children}

      <Footer/>

      </body>
    </html>
  );
}