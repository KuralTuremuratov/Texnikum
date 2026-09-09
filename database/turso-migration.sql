-- Texnikum data migration for Turso / libSQL (SQLite).
-- Run this entire file in the Turso SQL editor.

CREATE TABLE IF NOT EXISTS course_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_number INTEGER NOT NULL,
    day TEXT NOT NULL,
    para1 TEXT, para2 TEXT, para3 TEXT, para4 TEXT, para5 TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT '', description TEXT, image_url TEXT NOT NULL,
    image_path TEXT, uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS teacher_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher TEXT NOT NULL, dushanba TEXT, seshanba TEXT, chorshanba TEXT,
    payshanba TEXT, juma TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    shanba TEXT
);

INSERT INTO course_schedules (id, course_number, day, para1, para2, para3, para4, created_at) VALUES
    (17, 1, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-19 09:06:05.487009'),
    (14, 2, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-18 13:19:30.720111'),
    (12, 1, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-18 10:06:07.159502'),
    (15, 2, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-18 16:57:13.502602'),
    (18, 3, 'Yangi kun', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-08-08 15:42:06.197610')
ON CONFLICT(id) DO UPDATE SET course_number=excluded.course_number, day=excluded.day, para1=excluded.para1, para2=excluded.para2, para3=excluded.para3, para4=excluded.para4, created_at=excluded.created_at;

INSERT INTO gallery_images (id, title, description, image_url, image_path, uploaded_at, is_active) VALUES
    (7, '', '', 'https://aohkenbmaavhwvadwyqc.supabase.co/storage/v1/object/public/gallery/1752835343183-t971s52tgil.jpg', '1752835343183-t971s52tgil.jpg', '2025-07-18 10:42:27.450063', 1),
    (3, '', '', '/03.jpg', '03.jpg', '2025-07-18 10:12:47.990359', 1),
    (4, '', '', '/04.jpg', '04.jpg', '2025-07-18 10:12:47.990359', 1),
    (1, '', '', '/01.jpg', '01.jpg', '2025-07-18 10:12:47.990359', 1),
    (6, '', '', '/06.jpg', '06.jpg', '2025-07-18 10:12:47.990359', 1),
    (2, '', '', '/02.jpg', '02.jpg', '2025-07-18 10:12:47.990359', 1)
ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, image_url=excluded.image_url, image_path=excluded.image_path, uploaded_at=excluded.uploaded_at, is_active=excluded.is_active;

INSERT INTO teacher_schedules (id, teacher, dushanba, seshanba, chorshanba, payshanba, juma, created_at, shanba) VALUES
    (2, 'O''qituvchi 1', '-', 'Navbatchi', '-', '-', '-', '2025-07-18 09:14:13.776060', '-'),
    (1, 'Gulnur T', 'Navbatchi', '-', '-', '-', '-', '2025-07-18 09:14:13.776060', '-'),
    (7, 'O''qituvchi 4', '-', '-', 'Navbatchi', '-', '-', '2025-07-23 08:49:22.610606', '-'),
    (4, 'O''qituvchi 2', '-', '-', '-', 'Navbatchi', '-', '2025-07-18 09:14:13.776060', '-'),
    (5, 'O''qituvchi 3', '-', '-', '-', '-', 'Navbatchi', '2025-07-18 09:14:13.776060', '-')
ON CONFLICT(id) DO UPDATE SET teacher=excluded.teacher, dushanba=excluded.dushanba, seshanba=excluded.seshanba, chorshanba=excluded.chorshanba, payshanba=excluded.payshanba, juma=excluded.juma, created_at=excluded.created_at, shanba=excluded.shanba;

SELECT 'course_schedules' AS table_name, COUNT(*) AS rows FROM course_schedules
UNION ALL SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL SELECT 'teacher_schedules', COUNT(*) FROM teacher_schedules;
