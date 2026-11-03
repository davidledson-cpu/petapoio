-- PetApoio — Onda 1
-- Duas tabelas, ambas só de entrada: o público pode INSERIR, ninguém de fora pode LER.
-- A leitura acontece pelo painel do Supabase (ou, na Onda 2, pelo admin autenticado).
-- Não guardamos dados de saúde nem relatos de perda: só o necessário para responder.

create extension if not exists citext;

-- Inscrições em listas: newsletter, aviso de psicólogos disponíveis, aviso da loja.
create table public.interest_signups (
  id           bigint generated always as identity primary key,
  email        citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  list         text   not null check (list in ('newsletter', 'psicologos', 'loja')),
  consented_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (email, list)
);

-- Candidaturas de psicólogos parceiros (pré-cadastro; verificação de documentos na Onda 2).
create table public.professional_applications (
  id                  bigint generated always as identity primary key,
  full_name           text not null check (length(full_name) between 3 and 120),
  email               citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  phone               text check (length(phone) <= 30),
  crp                 text not null check (length(crp) between 4 and 20),
  crp_state           char(2) not null,
  city                text check (length(city) <= 80),
  modality            text not null check (modality in ('online', 'presencial', 'ambos')),
  grief_experience    text check (length(grief_experience) <= 2000),
  pet_grief_experience boolean not null default false,
  approach            text check (length(approach) <= 200),
  website             text check (length(website) <= 300),
  consented_at        timestamptz not null default now(),
  status              text not null default 'recebida' check (status in ('recebida', 'em_analise', 'aprovada', 'recusada')),
  created_at          timestamptz not null default now()
);

create unique index professional_applications_email_crp on public.professional_applications (email, crp);

alter table public.interest_signups enable row level security;
alter table public.professional_applications enable row level security;

-- Visitantes (papel "anon") só inserem. Sem políticas de SELECT/UPDATE/DELETE = sem leitura pública.
create policy "publico_pode_inscrever" on public.interest_signups
  for insert to anon with check (true);

create policy "publico_pode_candidatar" on public.professional_applications
  for insert to anon with check (status = 'recebida');

-- Remove privilégios desnecessários concedidos por padrão.
revoke select, update, delete on public.interest_signups from anon, authenticated;
revoke select, update, delete on public.professional_applications from anon, authenticated;
