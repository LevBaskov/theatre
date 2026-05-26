
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

const playDis = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["cyrillic"],
});


export default function RootLayout({children,}: 
  Readonly<{children: React.ReactNode;}>) {
  return (
    <html
      lang="ru"
      className={`${playDis.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
        <Header/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
