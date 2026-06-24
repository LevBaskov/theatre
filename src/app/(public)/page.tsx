"use client";

import { useState } from "react";
import AfishaSearch from "@/app/components/afisha/AfishaSearch";
import PerformanceCard from "@/app/components/afisha/PerformanceCard";

// Моковые данные с ID
const allPerformances = [
  {
    id: "1",
    title: "«Звонок»",
    date: "15 дек 2024",
    time: "18:30",
    location: "Главный зал",
    description: "Комедия положений о неожиданном телефонном звонке, который переворачивает жизнь героев.",
  },
  {
    id: "2",
    title: "«Новогодний переполох»",
    date: "22 дек 2024",
    time: "19:00",
    location: "Малая сцена",
    description: "Праздничный спектакль для всей семьи. История о том, как Дед Мороз потерял свой волшебный посох.",
  },
  {
    id: "3",
    title: "«Ирония судьбы»",
    date: "28 дек 2024",
    time: "18:00",
    location: "Главный зал",
    description: "Легендарная новогодняя комедия в исполнении нашей труппы. Трогательная история о любви.",
  },
];

export default function AfishaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPerformances = allPerformances.filter((performance) =>
    performance.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="afisha-page">
      <h2 className="page-title">Афиша</h2>
      <AfishaSearch onSearch={setSearchTerm} />
      
      <div className="cards-list">
        {filteredPerformances.length > 0 ? (
          filteredPerformances.map((performance) => (
            <PerformanceCard 
              key={performance.id} 
              {...performance}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#6d4c41", padding: "40px" }}>
            Ничего не найдено по запросу "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}