-- Employees table migration for Neon PostgreSQL
-- Run this in Neon Console -> SQL Editor

CREATE TABLE IF NOT EXISTS public.employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_employees_active ON public.employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_order ON public.employees(display_order);

-- Sample data (optional - you can add via admin panel)
-- INSERT INTO public.employees (name, position, photo_url, is_active, display_order)
-- VALUES 
--     ('John Doe', 'Direktor', '/placeholder-photo.jpg', true, 1),
--     ('Jane Smith', 'O''quv ishlari bo''yicha direktor o''rinbosari', '/placeholder-photo.jpg', true, 2);

COMMENT ON TABLE public.employees IS 'Xodimlar - список сотрудников техникума';
COMMENT ON COLUMN public.employees.name IS 'ФИО сотрудника';
COMMENT ON COLUMN public.employees.position IS 'Должность';
COMMENT ON COLUMN public.employees.photo_url IS 'URL фотографии (ImageKit или локальная)';
COMMENT ON COLUMN public.employees.is_active IS 'Отображается ли сотрудник на сайте';
COMMENT ON COLUMN public.employees.display_order IS 'Порядок отображения (меньше = выше)';
