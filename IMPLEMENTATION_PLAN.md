# План разработки: Афиша и Интерактивная карта мест

## 📋 Общая информация

**Цель:** Реализовать систему афиши спектаклей и интерактивную карту выбора мест для театра Сатиры.

**Технологический стек:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma + MySQL
- Tailwind CSS v4
- NextAuth.js

---

## 🗂️ Этап 1: Обновление схемы базы данных (Prisma)

### 1.1. Модели данных
Обновить `prisma/schema.prisma` следующими моделями:

```prisma
// Пользователи (расширить существующие)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  bookings  Booking[]
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}

// Спектакли
model Play {
  id          String   @id @default(uuid())
  title       String
  description String?
  duration    Int      // длительность в минутах
  ageRating   Int      // возрастное ограничение
  genre       String?
  imageUrl    String?
  director    String?
  cast        CastMember[]
  sessions    Session[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Актеры
model Actor {
  id        String   @id @default(uuid())
  name      String
  bio       String?
  photoUrl  String?
  cast      CastMember[]
  createdAt DateTime @default(now())
}

// Связь спектакль-актеры
model CastMember {
  id        String @id @default(uuid())
  play      Play   @relation(fields: [playId], references: [id])
  playId    String
  actor     Actor  @relation(fields: [actorId], references: [id])
  actorId   String
  roleName  String? // роль в спектакле
  
  @@unique([playId, actorId])
}

// Залы
model Hall {
  id        String   @id @default(uuid())
  name      String
  rows      Int      // количество рядов
  seatsPerRow Int    // мест в ряду
  schema    Json?    // JSON схема зала (для нестандартных конфигураций)
  seats     Seat[]
  sessions  Session[]
  createdAt DateTime @default(now())
}

// Места
model Seat {
  id        String   @id @default(uuid())
  hall      Hall     @relation(fields: [hallId], references: [id])
  hallId    String
  row       Int      // номер ряда
  number    Int      // номер места
  type      SeatType @default(STANDARD)
  price     Decimal
  bookings  Booking[]
  
  @@unique([hallId, row, number])
}

enum SeatType {
  STANDARD
  VIP
  BALCONY
}

// Сеансы (показы)
model Session {
  id        String   @id @default(uuid())
  play      Play     @relation(fields: [playId], references: [id])
  playId    String
  hall      Hall     @relation(fields: [hallId], references: [id])
  hallId    String
  startTime DateTime
  endTime   DateTime
  available Boolean  @default(true)
  bookings  Booking[]
  createdAt DateTime @default(now())
  
  @@index([startTime])
  @@index([playId, startTime])
}

// Бронирования
model Booking {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  session   Session  @relation(fields: [sessionId], references: [id])
  sessionId String
  seat      Seat     @relation(fields: [seatId], references: [id])
  seatId    String
  status    BookingStatus @default(PENDING)
  qrCode    String?
  totalPrice Decimal
  bookedAt  DateTime @default(now())
  expiresAt DateTime // время истечения брони
  
  @@unique([sessionId, seatId])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  EXPIRED
}
```

### 1.2. Генерация клиента Prisma
```bash
npx prisma generate
npx prisma db push
```

---

## 🎭 Этап 2: Разработка компонента Афиши

### 2.1. Структура файлов
```
src/app/
├── components/
│   ├── afisha/
│   │   ├── AfishaCard.tsx      // Карточка спектакля
│   │   ├── AfishaList.tsx      // Список спектаклей
│   │   ├── AfishaFilter.tsx    // Фильтры (жанр, дата)
│   │   └── index.ts
│   └── ...
├── (public)/
│   ├── afisha/
│   │   └── page.tsx            // Страница афиши
│   └── ...
└── api/
    └── plays/
        └── route.ts            // API endpoint
```

### 2.2. Компоненты

#### AfishaCard.tsx
- Изображение спектакля
- Название, жанр, возрастное ограничение
- Длительность
- Кнопка "Выбрать места"
- Дата и время ближайшего сеанса

#### AfishaList.tsx
- Сетка карточек (Grid layout)
- Пагинация или infinite scroll
- Сортировка по дате

#### AfishaFilter.tsx
- Фильтр по жанрам
- Фильтр по датам
- Поиск по названию

### 2.3. API Endpoints

#### GET /api/plays
```typescript
// Параметры: date, genre, page, limit
// Возвращает: список спектаклей с сеансами
```

#### GET /api/plays/[id]
```typescript
// Возвращает: детальную информацию о спектакле
```

---

## 🗺️ Этап 3: Интерактивная карта мест

### 3.1. Структура файлов
```
src/app/
├── components/
│   ├── seating-chart/
│   │   ├── SeatingChart.tsx    // Основной компонент карты
│   │   ├── Seat.tsx            // Компонент места
│   │   ├── Legend.tsx          // Легенда (типы мест)
│   │   ├── BookingSummary.tsx  // Выбранные места + сумма
│   │   └── index.ts
│   └── ...
├── (public)/
│   ├── booking/
│   │   └── [sessionId]/
│   │       └── page.tsx        // Страница бронирования
│   └── ...
└── api/
    └── sessions/
        └── [id]/
            └── seats/
                └── route.ts    // Доступность мест
```

### 3.2. Компоненты

#### SeatingChart.tsx
- Отрисовка схемы зала (ряды × места)
- Визуальное разделение типов мест (цветом)
- Интерактивность при клике
- Поддержка SVG для сложных схем залов

#### Seat.tsx
- Состояния: свободное, выбрано, забронировано, недоступно
- Tooltip с информацией (ряд, место, цена)
- Анимации при выборе

#### Legend.tsx
- Обозначения: Стандарт, VIP, Балкон
- Цветовая схема

#### BookingSummary.tsx
- Список выбранных мест
- Итоговая сумма
- Кнопка "Забронировать"

### 3.3. Логика работы

1. Пользователь выбирает спектакль → переход на страницу сеансов
2. Выбор даты/времени → переход на карту мест
3. Загрузка доступных мест из API
4. Выбор мест (multiple selection)
5. Проверка бизнес-правил:
   - Нельзя выбрать уже забронированное место
   - Бронь истекает через 15 минут
   - Максимум N мест в одни руки
6. Оформление бронирования

---

## 🔧 Этап 4: API для бронирования

### 4.1. Endpoints

#### GET /api/sessions/[id]/seats
```typescript
// Возвращает все места сессии со статусами
{
  seats: [
    {
      id: "...",
      row: 1,
      number: 5,
      type: "STANDARD",
      price: 500,
      status: "AVAILABLE" | "BOOKED" | "SELECTED"
    }
  ]
}
```

#### POST /api/bookings
```typescript
// Тело запроса:
{
  sessionId: string,
  seatIds: string[],
  userId?: string // если авторизован
}

// Возвращает: подтверждение брони с QR-кодом
```

#### DELETE /api/bookings/[id]
```typescript
// Отмена бронирования
```

### 4.2. Бизнес-логика

- Проверка доступности мест перед бронированием (транзакция)
- Автоматическая очистка просроченных броней (cron job)
- Генерация QR-кода (библиотека qrcode)
- Отправка письма с билетом (nodemailer)

---

## 🎨 Этап 5: Стилизация (Tailwind CSS)

### 5.1. Конфигурация
Добавить в `tailwind.config`:
- Цветовую палитру театра
- Кастомные шрифты
- Breakpoints для адаптивности

### 5.2. Компоненты UI
- Кнопки (primary, secondary, disabled states)
- Карточки с тенями и hover-эффектами
- Модальные окна для деталей спектакля
- Toast уведомления об ошибках/успехе

---

## ✅ Этап 6: Тестирование

### 6.1. Unit тесты
- Тесты компонентов (AfishaCard, Seat)
- Тесты утилит форматирования

### 6.2. Integration тесты
- API endpoints
- Сценарии бронирования

### 6.3. E2E тесты
- Полный путь пользователя: выбор → бронь → получение билета

---

## 📅 Приоритетный порядок реализации

| № | Задача | Оценка времени |
|---|--------|----------------|
| 1 | Обновление схемы Prisma | 2 часа |
| 2 | Создание моковых данных для тестов | 1 час |
| 3 | API endpoints для спектаклей | 2 часа |
| 4 | Компонент AfishaCard + AfishaList | 3 часа |
| 5 | Страница афиши с фильтрами | 2 часа |
| 6 | API endpoints для мест и бронирования | 3 часа |
| 7 | Компонент SeatingChart (базовый) | 4 часа |
| 8 | Логика выбора мест + BookingSummary | 3 часа |
| 9 | Интеграция с базой данных | 2 часа |
| 10 | Стилизация и полировка UI | 3 часа |
| 11 | Тестирование и исправление багов | 3 часа |

**Итого: ~28 часов чистого времени разработки**

---

## 🚀 Быстрый старт (MVP за 1 день)

Для максимально быстрой реализации сосредоточиться на:

1. **Схема БД** (только essential модели: Play, Session, Hall, Seat, Booking)
2. **API**: GET /plays, GET /sessions/:id/seats, POST /bookings
3. **Афиша**: простой список карточек без фильтров
4. **Карта мест**: grid-раскладка без SVG, 3 состояния мест
5. **Бронирование**: без QR-кодов и email, только создание записи в БД

---

## 📝 Примечания

- Использовать Server Components где возможно для лучшей производительности
- Real-time обновление доступности мест через Server-Sent Events или polling
- Кэширование списка спектаклей (ISR)
- Защита API от race conditions при бронировании (транзакции Prisma)
