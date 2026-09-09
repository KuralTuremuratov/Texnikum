-- Создание таблицы для расписания курсов
CREATE TABLE course_schedules (
  id SERIAL PRIMARY KEY,
  course_number INTEGER NOT NULL,
  day VARCHAR(20) NOT NULL,
  para1 VARCHAR(100),
  para2 VARCHAR(100),
  para3 VARCHAR(100),
  para4 VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы для расписания дежурств учителей
CREATE TABLE teacher_schedules (
  id SERIAL PRIMARY KEY,
  teacher VARCHAR(100) NOT NULL,
  dushanba VARCHAR(50),
  seshanba VARCHAR(50),
  chorshanba VARCHAR(50),
  payshanba VARCHAR(50),
  juma VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Вставка примерных данных для расписания 1 курса
INSERT INTO course_schedules (course_number, day, para1, para2, para3, para4) VALUES
(1, 'Dushanba', 'Matematika', 'Fizika', 'Ingliz tili', 'Dasturlash'),
(1, 'Seshanba', 'Kimyo', 'Tarix', 'Adabiyot', 'Sport'),
(1, 'Chorshanba', 'Matematika', 'Informatika', 'Geografiya', 'Dasturlash'),
(1, 'Payshanba', 'Fizika', 'Ingliz tili', 'Biologiya', 'Kimyo'),
(1, 'Juma', 'Tarix', 'Adabiyot', 'Sport', 'Matematika');

-- Вставка примерных данных для расписания 2 курса
INSERT INTO course_schedules (course_number, day, para1, para2, para3, para4) VALUES
(2, 'Dushanba', 'Web dasturlash', 'Ma\'lumotlar bazasi', 'Algoritm', 'Loyihalash'),
(2, 'Seshanba', 'Tarmoq', 'Xavfsizlik', 'Ingliz tili', 'Sport'),
(2, 'Chorshanba', 'Frontend', 'Backend', 'DevOps', 'Amaliyot'),
(2, 'Payshanba', 'Mobile dasturlash', 'AI asoslari', 'Grafik dizayn', 'Loyiha'),
(2, 'Juma', 'Testlash', 'Deployment', 'Prezentatsiya', 'Baholash');

-- Вставка примерных данных для дежурства учителей
INSERT INTO teacher_schedules (teacher, dushanba, seshanba, chorshanba, payshanba, juma) VALUES
('Aliyev A.A.', 'Navbatchi', '-', '-', '-', '-'),
('Karimova M.K.', '-', 'Navbatchi', '-', '-', '-'),
('Toshmatov B.T.', '-', '-', 'Navbatchi', '-', '-'),
('Rahimova S.R.', '-', '-', '-', 'Navbatchi', '-'),
('Usmanov D.U.', '-', '-', '-', '-', 'Navbatchi');

-- Включение Row Level Security
ALTER TABLE course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_schedules ENABLE ROW LEVEL SECURITY;

-- Политики для чтения (все могут читать)
CREATE POLICY "Allow read access for all users" ON course_schedules FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON teacher_schedules FOR SELECT USING (true);

-- Политики для записи (только аутентифицированные пользователи)
CREATE POLICY "Allow insert for authenticated users" ON course_schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON course_schedules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON course_schedules FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON teacher_schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON teacher_schedules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON teacher_schedules FOR DELETE USING (auth.role() = 'authenticated');
