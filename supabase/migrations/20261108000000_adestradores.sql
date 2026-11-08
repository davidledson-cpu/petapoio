-- PetApoio Cuida · Adestradores: candidatura pública, análise pela equipe.

create table if not exists public.trainers (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text unique,
  status                 text not null default 'pendente'
                           check (status in ('pendente', 'aprovado', 'recusado', 'suspenso')),
  review_note            text,
  full_name              text not null check (length(full_name) between 3 and 120),
  email                  citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                  text not null check (length(phone) between 10 and 30),
  city                   text not null default 'Belo Horizonte',
  neighborhood           text not null check (length(neighborhood) between 2 and 80),
  radius_km              int not null default 10 check (radius_km between 1 and 30),
  modalities             text[] not null check (
                           cardinality(modalities) > 0
                           and modalities <@ array['domicilio', 'online', 'grupo', 'espaco_proprio']),
  species                text[] not null default array['cao'] check (species <@ array['cao', 'gato', 'outros']),
  focus                  text[] not null check (
                           cardinality(focus) between 1 and 6
                           and focus <@ array['filhotes', 'obediencia', 'passeio', 'comportamento', 'socializacao',
                                              'ansiedade_separacao', 'gatos', 'idosos', 'adaptacao_novo_pet']),
  formats                text[] not null check (
                           cardinality(formats) > 0
                           and formats <@ array['avaliacao', 'aula_avulsa', 'pacote', 'consultoria']),
  price_assessment_cents int check (price_assessment_cents between 0 and 500000),
  price_class_cents      int check (price_class_cents between 0 and 500000),
  price_package_cents    int check (price_package_cents between 0 and 500000),
  price_consult_cents    int check (price_consult_cents between 0 and 500000),
  package_classes        int check (package_classes between 2 and 30),
  years_experience       int not null default 0 check (years_experience between 0 and 5),
  headline               text check (length(headline) <= 160),
  experience             text check (length(experience) <= 2000),
  qualifications         text check (length(qualifications) <= 1000),
  reference_contacts     text check (length(reference_contacts) <= 500),
  portfolio_url          text check (length(portfolio_url) <= 200),
  positive_methods       boolean not null default false,
  accepted_terms_at      timestamptz not null default now(),
  approved_at            timestamptz,
  created_at             timestamptz not null default now()
);
-- Referências informadas no cadastro (só a equipe vê; fora da vitrine pública).
alter table public.caregivers add column if not exists reference_contacts text check (length(reference_contacts) <= 500);

create index if not exists trainers_status_idx on public.trainers (status, neighborhood);

alter table public.trainers enable row level security;

drop policy if exists trainers_apply on public.trainers;
create policy trainers_apply on public.trainers for insert to anon, authenticated with check (
  status = 'pendente' and slug is null and approved_at is null and review_note is null and positive_methods
);
drop policy if exists trainers_admin on public.trainers;
create policy trainers_admin on public.trainers for all using (public.is_admin()) with check (public.is_admin());
