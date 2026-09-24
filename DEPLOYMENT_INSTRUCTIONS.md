# 🚀 Инструкции по деплою обновлений

## ✅ Выполненные изменения (9 из 12 задач)

### 1. ✅ Изменено название техникума
- **Header**: "Xo'jayli tumani 3-sonli texnikumi"
- **Footer**: "Xo'jayli tumani 3-sonli texnikumi" + "O'mir dawaminda bilim al!"
- **Copyright**: © 2026 Xo'jayli tumani 3-sonli texnikumi

### 2. ✅ Заменены блоки направлений на 3 новых:
- **Блок 1**: 11-sinf bitiruvchilari (Dasturiy injiniring)
- **Блок 2**: 9-sinf bitiruvchilari (6 направлений)
- **Блок 3**: Dual ta'lim (3 направления)

### 3. ✅ Обновлены контакты:
**4 телефона:**
- +998 55 106 20 67
- +998 90 700 78 67
- +998 91 371 50 25
- +998 91 305 12 87

**Адрес:**
- Xo'jayli tumani, Bog'bon MFY, Buyuk kelajak ko'chasi 19-uy
- Mo'ljal: Nukus–Xo'jayli yo'li bo'yida

### 4. ✅ Создана новая страница "Xodimlar"
- URL: `/xodimlar`
- Добавлен пункт в навигацию (между "Bosh sahifa" и "Navbatchilik")
- Grid layout с фото 3x4
- Адаптивный дизайн (desktop/tablet/mobile)

### 5. ✅ Добавлена админка для Xodimlar
- Новая вкладка "Xodimlar" в админ-панели
- CRUD операции: добавить, редактировать, удалить
- Загрузка фото через ImageKit
- Управление порядком отображения (display_order)
- Активация/деактивация сотрудников

### 6. ✅ База данных
- Создана таблица `employees` в Neon PostgreSQL
- Поля: id, name, position, photo_url, is_active, display_order
- Обновлен API в `netlify/functions/api.js`
- SQL миграция: `database/employees-migration.sql`

---

## ⚠️ Необходимо выполнить вручную (3 задачи)

### Задача #9: Заменить логотип
1. Скопируйте новый файл `logo.png` (из загруженных файлов)
2. Вставьте в папку `public/` (перезапишите существующий)
3. Размер должен быть оптимальным для веб (рекомендуется 200x200px или SVG)

### Задача #10: Заменить главное изображение
1. Скопируйте файл `homepage_main.jpg` (из загруженных файлов)
2. Вставьте в папку `public/`
3. Код уже обновлён в `Home.js` (использует `/homepage_main.jpg`)

### Задача #12: Миграция базы данных
**Важно!** Запустите SQL миграцию в Neon Console:

1. Перейдите на https://neon.tech
2. Откройте проект **Texnikum**
3. Перейдите в **SQL Editor**
4. Скопируйте и выполните содержимое файла `database/employees-migration.sql`

```sql
-- Создание таблицы employees
CREATE TABLE IF NOT EXISTS public.employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_employees_active ON public.employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_order ON public.employees(display_order);
```

---

## 🔧 Команды для деплоя

### Локальная проверка:
```bash
# Установить зависимости (если нужно)
npm install

# Запустить dev-сервер
npm start

# Открыть http://localhost:3000
```

### Сборка и деплой:
```bash
# Сборка production
npm run build

# Коммит изменений
git add .
git commit -m "feat: major update - new name, directions, contacts, employees page

✨ Изменения:
- Название: Xo'jayli tumani 3-sonli texnikumi
- 3 блока направлений (11-sinf, 9-sinf, Dual ta'lim)
- 4 телефона + новый адрес (Bog'bon MFY 19-uy)
- Новая страница /xodimlar с фото сотрудников
- Админка для управления Xodimlar
- База данных: таблица employees в Neon"

# Push на GitHub (Netlify задеплоит автоматически)
git push origin main
```

---

## 📂 Изменённые файлы

### Frontend (React):
- `src/components/Header.js` - новое название, пункт Xodimlar
- `src/components/Footer.js` - контакты, адрес, название
- `src/pages/Home.js` - новые направления, homepage_main.jpg
- `src/pages/Xodimlar.js` - **новая страница**
- `src/pages/Admin.js` - вкладка Xodimlar с CRUD
- `src/App.js` - маршрут /xodimlar
- `src/App.css` - стили для Xodimlar и админки

### Backend:
- `netlify/functions/api.js` - добавлена таблица employees
- `database/employees-migration.sql` - **новая миграция**

---

## 🧪 Тестирование после деплоя

### Проверьте следующее:

1. **Главная страница**:
   - [ ] Название техникума отображается корректно
   - [ ] 3 блока направлений с правильными данными
   - [ ] Главное изображение загружается (homepage_main.jpg)

2. **Header (навигация)**:
   - [ ] Пункт "Xodimlar" между "Bosh sahifa" и "Navbatchilik"
   - [ ] Все ссылки работают

3. **Footer**:
   - [ ] 4 телефона отображаются
   - [ ] Новый адрес: Bog'bon MFY, 19-uy
   - [ ] Mo'ljal отображается
   - [ ] Логотип обновлён

4. **Страница Xodimlar** (`/xodimlar`):
   - [ ] Страница открывается
   - [ ] Grid layout работает корректно
   - [ ] Placeholder изображения для пустых фото
   - [ ] Breadcrumbs работают

5. **Админ-панель** (`/login` → `/admin`):
   - [ ] Вкладка "Xodimlar" появилась
   - [ ] Можно добавить нового сотрудника
   - [ ] Можно редактировать данные
   - [ ] Можно загрузить фото
   - [ ] Можно удалить сотрудника
   - [ ] Можно изменить порядок (display_order)

6. **База данных (Neon Console)**:
   - [ ] Таблица `employees` создана
   - [ ] Можно выполнить `SELECT * FROM employees;`

---

## 🐛 Возможные проблемы и решения

### Проблема: Страница Xodimlar пустая
**Причина**: Таблица employees не создана или пустая  
**Решение**: Выполнить SQL миграцию в Neon Console

### Проблема: Фото не загружаются
**Причина**: ImageKit не настроен  
**Решение**: Проверить переменные окружения `IMAGEKIT_PUBLIC_KEY` и `IMAGEKIT_PRIVATE_KEY` в Netlify

### Проблема: "Database table employees does not exist"
**Причина**: Миграция не выполнена  
**Решение**: Запустить `database/employees-migration.sql` в Neon SQL Editor

### Проблема: Логотип не обновился
**Причина**: Кеширование браузера  
**Решение**: Очистить кеш (Ctrl+Shift+R) или Hard Refresh

### Проблема: homepage_main.jpg не отображается
**Причина**: Файл не загружен в public/  
**Решение**: Скопировать файл в `public/homepage_main.jpg` и пересобрать

---

## 📊 Статистика изменений

- **Изменённых файлов**: 9
- **Новых файлов**: 2 (Xodimlar.js, employees-migration.sql)
- **Новых строк кода**: ~800
- **Новых API endpoints**: 1 (employees)
- **Новых страниц**: 1 (/xodimlar)
- **Новых таблиц БД**: 1 (employees)

---

## 🎯 Следующие шаги

После успешного деплоя:

1. **Добавить первых сотрудников**:
   - Войти в админ-панель
   - Перейти на вкладку "Xodimlar"
   - Добавить сотрудников с фотографиями

2. **Обновить контент**:
   - Проверить правильность всех данных
   - Убедиться что направления актуальны

3. **SEO и метатеги** (опционально):
   - Обновить `public/index.html` с новым названием
   - Добавить метаописание
   - Обновить Open Graph теги

4. **Производительность**:
   - Оптимизировать изображения (сжатие)
   - Проверить скорость загрузки

---

**Последнее обновление**: Февраль 2026  
**Версия**: 2.0.0 (Major Update)
