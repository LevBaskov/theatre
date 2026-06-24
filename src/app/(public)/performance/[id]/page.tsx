import PerformanceDetails from "@/components/performance/PerformanceDetails";
import { notFound } from "next/navigation";

// Моковые данные (в будущем заменим на запрос к Prisma)
const performancesData: Record<string, {
  title: string;
  genre: string;
  director: string;
  actors: string[];
  description: string;
}> = {
  "1": {
    title: "«Звонок»",
    genre: "Комедия",
    director: "Иванов И.И.",
    actors: ["Сидоров М.К.", "Козлова Е.В."],
    description: "Комедия положений о неожиданном телефонном звонке, который переворачивает жизнь героев. Офисный работник, привыкший к рутине, вдруг получает сообщение, меняющее всё его мировоззрение.",
  },
  "2": {
    title: "«Новогодний переполох»",
    genre: "Детский спектакль",
    director: "Петрова А.С.",
    actors: ["Новиков Д.А.", "Сидоров М.К."],
    description: "Праздничный спектакль для всей семьи. История о том, как Дед Мороз потерял свой волшебный посох и вместе с помощниками пытается найти его до наступления Нового года.",
  },
  "3": {
    title: "«Ирония судьбы»",
    genre: "Комедия",
    director: "Иванов И.И.",
    actors: ["Козлова Е.В.", "Новиков Д.А.", "Сидоров М.К."],
    description: "Легендарная новогодняя комедия в исполнении нашей труппы. Трогательная история о любви, которая случается в самую неожиданную ночь.",
  },
};

// Генерируем статические пути для всех спектаклей
export async function generateStaticParams() {
  return Object.keys(performancesData).map((id) => ({
    id,
  }));
}

export default async function PerformancePage({ 
  params 
}: { 
  params: Promise<{ id: string }>  // params теперь Promise
}) {
  const { id } = await params;  // Await params перед использованием
  const performance = performancesData[id];

  if (!performance) {
    notFound();
  }

  return (
    <div className="page-layout">
      <h2 className="page-title" style={{ marginBottom: "30px", textAlign: "center" }}>
        Информация о спектакле
      </h2>
      <PerformanceDetails {...performance} />
    </div>
  );
}