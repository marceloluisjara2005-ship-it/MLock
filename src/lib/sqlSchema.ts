export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- MLock: Base de Datos y Políticas RLS en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- =========================================================

-- 1. Habilitar extensión UUID (por defecto activa en Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla para Apartados / Categorías Personalizadas
CREATE TABLE IF NOT EXISTS public.mlock_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT DEFAULT 'folder',
    color TEXT DEFAULT 'violet',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_mlock_categories_user_id ON public.mlock_categories(user_id);

-- 3. Tabla principal para Elementos (Cuentas, Notas, Links, PDFs y Personalizados)
CREATE TABLE IF NOT EXISTS public.mlock_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_mlock_items_user_id ON public.mlock_items(user_id);
CREATE INDEX IF NOT EXISTS idx_mlock_items_category ON public.mlock_items(category);
CREATE INDEX IF NOT EXISTS idx_mlock_items_created_at ON public.mlock_items(created_at DESC);

-- =========================================================
-- 4. SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- Cada usuario solo puede ver, crear, editar y eliminar sus propios registros
-- =========================================================

-- RLS en Categorías
ALTER TABLE public.mlock_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver únicamente sus categorías" 
ON public.mlock_categories FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propias categorías" 
ON public.mlock_categories FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias categorías" 
ON public.mlock_categories FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias categorías" 
ON public.mlock_categories FOR DELETE 
USING (auth.uid() = user_id);

-- RLS en Elementos
ALTER TABLE public.mlock_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver únicamente sus propios elementos" 
ON public.mlock_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios elementos" 
ON public.mlock_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios elementos" 
ON public.mlock_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios elementos" 
ON public.mlock_items FOR DELETE 
USING (auth.uid() = user_id);

-- =========================================================
-- 5. SUPABASE STORAGE PARA ARCHIVOS PDF
-- Bucket: 'mlock-files'
-- =========================================================

-- Crear el bucket de almacenamiento (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mlock-files', 'mlock-files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS para Storage: los archivos se guardan en la carpeta con el ID del usuario: {user_id}/{filename}
CREATE POLICY "Acceso de lectura a PDFs propios"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mlock-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Subida de PDFs propios"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mlock-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Actualización de PDFs propios"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'mlock-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Eliminación de PDFs propios"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'mlock-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
`;
