-- Criar tabela de inscrições para treinamento
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  corporate_email TEXT NOT NULL,
  department TEXT NOT NULL,
  automation_familiarity TEXT NOT NULL,
  participation_day TEXT NOT NULL,
  needs_accessibility BOOLEAN NOT NULL DEFAULT false,
  accessibility_description TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (inscrições)
CREATE POLICY "Anyone can insert registrations"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Política para leitura pública (para o painel RH - simplificado para demo)
CREATE POLICY "Anyone can view registrations"
ON public.registrations
FOR SELECT
USING (true);

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;