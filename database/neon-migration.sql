-- Texnikum: data migration for a NEW Neon PostgreSQL database.
-- Run this entire file in Neon Console -> SQL Editor.
-- It is intentionally idempotent: it does not drop existing tables.

CREATE TABLE IF NOT EXISTS public.course_schedules (
    id SERIAL PRIMARY KEY,
    course_number INTEGER NOT NULL,
    day VARCHAR(20) NOT NULL,
    para1 VARCHAR(100),
    para2 VARCHAR(100),
    para3 VARCHAR(100),
    para4 VARCHAR(100),
    para5 VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    description TEXT,
    image_url TEXT NOT NULL,
    image_path TEXT,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.teacher_schedules (
    id SERIAL PRIMARY KEY,
    teacher VARCHAR(100) NOT NULL,
    dushanba VARCHAR(50),
    seshanba VARCHAR(50),
    chorshanba VARCHAR(50),
    payshanba VARCHAR(50),
    juma VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    shanba VARCHAR(50)
);

INSERT INTO public.course_schedules
    (id, course_number, day, para1, para2, para3, para4, created_at)
VALUES
    (17, 1, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-19 09:06:05.487009'),
    (14, 2, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-18 13:19:30.720111'),
    (12, 1, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-18 10:06:07.159502'),
    (15, 2, 'Dasturiy injiniring', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-07-18 16:57:13.502602'),
    (18, 3, 'Yangi kun', 'Fan 1', 'Fan 2', 'Fan 3', 'Fan 4', '2025-08-08 15:42:06.197610')
ON CONFLICT (id) DO UPDATE SET
    course_number = EXCLUDED.course_number,
    day = EXCLUDED.day,
    para1 = EXCLUDED.para1,
    para2 = EXCLUDED.para2,
    para3 = EXCLUDED.para3,
    para4 = EXCLUDED.para4,
    created_at = EXCLUDED.created_at;

INSERT INTO public.gallery_images
    (id, title, description, image_url, image_path, uploaded_at, is_active)
VALUES
    (7, '', '', 'https://aohkenbmaavhwvadwyqc.supabase.co/storage/v1/object/public/gallery/1752835343183-t971s52tgil.jpg', '1752835343183-t971s52tgil.jpg', '2025-07-18 10:42:27.450063', true),
    (3, '', '', '/03.jpg', '03.jpg', '2025-07-18 10:12:47.990359', true),
    (4, '', '', '/04.jpg', '04.jpg', '2025-07-18 10:12:47.990359', true),
    (1, '', '', '/01.jpg', '01.jpg', '2025-07-18 10:12:47.990359', true),
    (6, '', '', '/06.jpg', '06.jpg', '2025-07-18 10:12:47.990359', true),
    (2, '', '', '/02.jpg', '02.jpg', '2025-07-18 10:12:47.990359', true)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    image_path = EXCLUDED.image_path,
    uploaded_at = EXCLUDED.uploaded_at,
    is_active = EXCLUDED.is_active;

INSERT INTO public.teacher_schedules
    (id, teacher, dushanba, seshanba, chorshanba, payshanba, juma, created_at, shanba)
VALUES
    (2, 'O''qituvchi 1', '-', 'Navbatchi', '-', '-', '-', '2025-07-18 09:14:13.776060', '-'),
    (1, 'Gulnur T', 'Navbatchi', '-', '-', '-', '-', '2025-07-18 09:14:13.776060', '-'),
    (7, 'O''qituvchi 4', '-', '-', 'Navbatchi', '-', '-', '2025-07-23 08:49:22.610606', '-'),
    (4, 'O''qituvchi 2', '-', '-', '-', 'Navbatchi', '-', '2025-07-18 09:14:13.776060', '-'),
    (5, 'O''qituvchi 3', '-', '-', '-', '-', 'Navbatchi', '2025-07-18 09:14:13.776060', '-')
ON CONFLICT (id) DO UPDATE SET
    teacher = EXCLUDED.teacher,
    dushanba = EXCLUDED.dushanba,
    seshanba = EXCLUDED.seshanba,
    chorshanba = EXCLUDED.chorshanba,
    payshanba = EXCLUDED.payshanba,
    juma = EXCLUDED.juma,
    created_at = EXCLUDED.created_at,
    shanba = EXCLUDED.shanba;

SELECT setval(pg_get_serial_sequence('public.course_schedules', 'id'), COALESCE((SELECT MAX(id) FROM public.course_schedules), 1), true);
SELECT setval(pg_get_serial_sequence('public.gallery_images', 'id'), COALESCE((SELECT MAX(id) FROM public.gallery_images), 1), true);
SELECT setval(pg_get_serial_sequence('public.teacher_schedules', 'id'), COALESCE((SELECT MAX(id) FROM public.teacher_schedules), 1), true);
