# 📚 Xo'jayli Texnikumi - Информация о проекте

## 🎯 О проекте

**Xo'jayli Texnikumi** — веб-сайт образовательного техникума в Узбекистане (Xo'jayli tumani, Bag'man MFY, Buyuk kelajak ko'chasi).

Сайт предоставляет информацию о:
- 📖 Направлениях обучения (5 специальностей)
- 📅 Расписании занятий для студентов
- 👨‍🏫 Расписании дежурств преподавателей
- 🖼️ Фотогалерее мероприятий техникума
- 📞 Контактах и местоположении

---

## 🛠️ Технологический стек

### Frontend
- **React 18.2.0** — библиотека для построения UI
- **React Router DOM 6.8.1** — маршрутизация
- **Lucide React** — современные иконки
- **CSS3** — кастомная стилизация с CSS Variables
- **Create React App** — сборщик проекта

### Backend & Database
- **Netlify Functions** — serverless API (Node.js)
- **Neon Database** — PostgreSQL-совместимая база данных (serverless)
- **@neondatabase/serverless** — клиент для подключения к Neon
- **Supabase** — использовался ранее, сейчас мигрирован на Neon

### Хостинг & Деплой
- **Netlify** — хостинг и CI/CD
  - URL: https://texnikumdemo.netlify.app
  - Автоматический деплой из GitHub (main branch)
  - Netlify Functions для API endpoints

---

## 🗄️ База данных (Neon PostgreSQL)

### Таблицы:

**1. `course_schedules`** — расписание занятий по курсам/группам
```sql
- id (SERIAL PRIMARY KEY)
- course_name (VARCHAR) — название группы
- dushanba, seshanba, chorshanba, payshanba, juma, shanba (TEXT) — предметы по дням
- created_at (TIMESTAMP)
```

**2. `teacher_schedules`** — расписание дежурств преподавателей
```sql
- id (SERIAL PRIMARY KEY)
- teacher_name (VARCHAR) — имя преподавателя
- dushanba, seshanba, chorshanba, payshanba, juma, shanba (TEXT) — дежурства по дням
- created_at (TIMESTAMP)
```

**3. `gallery`** — фотогалерея
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR) — название фото
- description (TEXT) — описание
- image_url (TEXT) — URL изображения
- category (VARCHAR) — категория (Tadbirlar, Talabalar, Bino, Yutuqlar)
- is_active (BOOLEAN) — активно/неактивно
- uploaded_at (TIMESTAMP)
```

### Подключение:
- Используется `@neondatabase/serverless` через Netlify Functions
- Connection string хранится в переменных окружения Netlify: `DATABASE_URL`

---

## 🌐 Netlify Configuration

### Build Settings
```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"
```

### Environment Variables (Netlify Dashboard)
```
DATABASE_URL — Neon PostgreSQL connection string
ADMIN_EMAIL — email администратора 1
ADMIN_PASSWORD_HASH — хеш пароля администратора 1
ADMIN_EMAIL_2 — email администратора 2
ADMIN_PASSWORD_HASH_2 — хеш пароля администратора 2
JWT_SECRET — секретный ключ для JWT токенов
IMAGEKIT_PUBLIC_KEY — публичный ключ ImageKit (если используется)
IMAGEKIT_PRIVATE_KEY — приватный ключ ImageKit (если используется)
```

### Netlify Functions
- **API Endpoint**: `/.netlify/functions/api`
- **Поддерживаемые actions**:
  - `login` — аутентификация администратора
  - `session` — проверка сессии
  - `select` — получение данных (расписания, галерея)
  - `insert`, `update`, `delete` — управление данными (только для авторизованных)

---

## 🔐 Система аутентификации

### Админ-панель
- **URL**: https://texnikumdemo.netlify.app/login (скрыт от обычных пользователей)
- **Аутентификация**: JWT tokens (sessionStorage)
- **Защита**: хеширование паролей (SHA-256), проверка через Netlify Functions
- **Сессия**: 8 часов
- **Два администратора** с отдельными учётными записями

### Генерация хеша пароля
```bash
node scripts/hash-admin-password.js "your-password"
```

---

## 📂 Структура проекта

```
texnikum/
├── public/               # Статические файлы (логотипы, фото)
├── src/
│   ├── components/       # Компоненты (Header, Footer)
│   ├── pages/            # Страницы (Home, Schedule, Gallery, Admin, Login)
│   ├── contexts/         # React Context (ThemeContext)
│   ├── lib/              # Утилиты (supabase.js — обёртка для API)
│   ├── App.js            # Главный компонент
│   ├── App.css           # Стили
│   └── index.js          # Точка входа
├── netlify/
│   └── functions/
│       └── api.js        # Serverless API
├── database/
│   └── neon-migration.sql # SQL схема
├── scripts/
│   └── hash-admin-password.js # Генератор хешей
├── .env                  # Локальные переменные (не в git)
├── netlify.toml          # Конфигурация Netlify
└── package.json          # Зависимости

```

---

## 🚀 Deployment Flow

### Автоматический деплой:
1. Код пушится в GitHub (main branch)
2. Netlify автоматически запускает build
3. Запускается `npm run build` → создаётся папка `build/`
4. Netlify публикует `build/` на CDN
5. Netlify Functions деплоятся из `netlify/functions/`
6. Сайт доступен по URL: https://texnikumdemo.netlify.app

### Ручной деплой:
```bash
npm run build
netlify deploy --prod
```

---

## 🎨 Особенности UI/UX

### Реализованные функции:
- ✅ **Lightbox** в галерее с навигацией стрелками
- ✅ **Live-поиск** в расписании (по группе, предмету, преподавателю)
- ✅ **Фильтры по категориям** в галерее (Tadbirlar, Talabalar, Bino, Yutuqlar)
- ✅ **Breadcrumbs** на всех внутренних страницах
- ✅ **Тёмная/светлая тема** с сохранением в localStorage
- ✅ **Цветовая кодировка** дней недели в таблицах
- ✅ **Google Maps** интеграция в футере
- ✅ **Адаптивный дизайн** (desktop, tablet, mobile)
- ✅ **Анимации и hover-эффекты**

### Скрытые элементы:
- Декоративные элементы (orbit, hero-card) скрыты на мобильных (<768px)
- Кнопка "Admin kirish" полностью скрыта от пользователей

---

## 📱 Адаптивность

### Breakpoints:
- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px
- **Small Mobile**: < 430px

### Мобильная версия:
- Гамбургер-меню
- Компактная навигация
- Карточный вид таблиц на узких экранах
- Touch-friendly интерфейс

---

## 🔧 Локальная разработка

### Установка:
```bash
npm install
```

### Запуск dev-сервера:
```bash
npm start
# Откроется http://localhost:3000
```

### Сборка production:
```bash
npm run build
```

### Тестирование Netlify Functions локально:
```bash
netlify dev
# Запустится http://localhost:8888
```

---

## 📊 Координаты техникума

- **Адрес**: Xo'jayli tumani, Bag'man MFY, Buyuk kelajak ko'chasi
- **Координаты**: 42.4345870925213, 59.504971954099005
- **Google Maps**: https://maps.app.goo.gl/f2yPCx89byCNGbDC8
- **Телефон**: +998 55 106 20 67

---

## 📝 Миграция с Supabase на Neon

### Причина миграции:
- Более высокая производительность Neon для serverless
- Лучшая интеграция с Netlify Functions
- PostgreSQL-совместимость

### Что изменилось:
- API перенесён в Netlify Functions (`netlify/functions/api.js`)
- База данных перенесена на Neon PostgreSQL
- Клиент заменён на `@neondatabase/serverless`
- Переменная окружения: `DATABASE_URL` вместо `SUPABASE_URL`

### SQL миграция:
Файл: `database/neon-migration.sql`

---

## 🎓 Направления обучения

### Основные специальности:
1. **50320203** – Kutubxonashunoslik va bibliografiya
2. **50610201** – Dasturiy injiniring
3. **40110104** – Maktabgacha ta'lim muassasasi tarbiyachisi
4. **40110104** – Maktabgacha ta'lim muassasasi yordamchi tarbiyachisi
5. **40110201** – Maktabgacha ta'lim muassasasi musiqa rahbari

### Dual-ta'lim:
- **40110104** – Maktabgacha ta'lim muassasasi tarbiyachisi
- **40110201** – Maktabgacha ta'lim muassasasi musiqa rahbari

---

## 📞 Поддержка

- **Email**: см. переменные окружения (`ADMIN_EMAIL`)
- **Телефон**: +998 55 106 20 67
- **Сайт**: https://texnikumdemo.netlify.app

---

## 📜 Лицензия

© 2024-2026 Xo'jayli Texnikumi. Все права защищены.

---

**Последнее обновление**: Февраль 2026
