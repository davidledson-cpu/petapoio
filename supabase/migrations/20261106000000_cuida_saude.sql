-- ─────────────────────────────────────────────────────────────────────────────
-- Expansão do ecossistema: PetApoio Cuida (cuidadores) e PetApoio Saúde
-- (lista do clube de benefícios + carteira digital de saúde do pet).
--
-- Princípios:
-- * Endereço e contato de cuidadores nunca são públicos; a vitrine mostra só o bairro.
-- * No piloto, as reservas são "acompanhadas": o tutor faz uma solicitação e a equipe
--   PetApoio confirma com o cuidador. Pagamento pela plataforma entra no MVP comercial.
-- * Dados de saúde do pet pertencem ao tutor. A administração só vê números agregados.
-- ─────────────────────────────────────────────────────────────────────────────

-- Comissão do Cuida (separada da comissão das sessões de psicologia).
alter table public.platform_settings
  add column if not exists care_fee_percent numeric(5,2) not null default 18
  check (care_fee_percent between 0 and 40);

-- Novas listas de interesse.
alter table public.interest_signups drop constraint if exists interest_signups_list_check;
alter table public.interest_signups
  add constraint interest_signups_list_check
  check (list in ('newsletter', 'psicologos', 'loja', 'cuida', 'saude'));

-- ── Cuidadores ───────────────────────────────────────────────────────────────
create table public.caregivers (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique,
  status              text not null default 'pendente'
                        check (status in ('pendente', 'aprovado', 'recusado', 'suspenso')),
  level               text not null default 'cadastrado'
                        check (level in ('cadastrado', 'verificado', 'qualificado', 'especializado')),
  review_note         text,
  full_name           text not null check (length(full_name) between 3 and 120),
  email               citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone               text not null check (length(phone) between 10 and 30),
  city                text not null default 'Belo Horizonte',
  neighborhood        text not null check (length(neighborhood) between 2 and 80),
  radius_km           int not null default 5 check (radius_km between 1 and 30),
  services            text[] not null check (
                        cardinality(services) > 0
                        and services <@ array['hospedagem', 'visita', 'passeio', 'creche', 'especiais']),
  species             text[] not null default array['cao'] check (species <@ array['cao', 'gato', 'outros']),
  pet_sizes           text[] not null default array['pequeno', 'medio'] check (pet_sizes <@ array['pequeno', 'medio', 'grande']),
  headline            text check (length(headline) <= 160),
  bio                 text check (length(bio) <= 2000),
  experience          text check (length(experience) <= 2000),
  qualifications      text check (length(qualifications) <= 1000),
  price_hosting_cents int check (price_hosting_cents between 0 and 100000),
  price_visit_cents   int check (price_visit_cents between 0 and 100000),
  price_walk_cents    int check (price_walk_cents between 0 and 100000),
  price_daycare_cents int check (price_daycare_cents between 0 and 100000),
  gives_medication    boolean not null default false,
  accepts_seniors     boolean not null default false,
  accepts_puppies     boolean not null default false,
  has_yard            boolean not null default false,
  accepted_terms_at   timestamptz not null default now(),
  approved_at         timestamptz,
  created_at          timestamptz not null default now()
);
create index caregivers_status_idx on public.caregivers (status, neighborhood);

-- Vitrine pública: só aprovados, sem e-mail, telefone ou observações internas.
create view public.caregiver_directory
with (security_invoker = false) as
  select id, slug, level, full_name, city, neighborhood, radius_km, services, species, pet_sizes,
         headline, bio, experience, qualifications,
         price_hosting_cents, price_visit_cents, price_walk_cents, price_daycare_cents,
         gives_medication, accepts_seniors, accepts_puppies, has_yard, approved_at
    from public.caregivers
   where status = 'aprovado' and slug is not null;

-- ── Solicitações de reserva (piloto acompanhado) ─────────────────────────────
create table public.care_requests (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  tutor_id       uuid not null references public.profiles (id) on delete cascade,
  caregiver_id   uuid not null references public.caregivers (id) on delete restrict,
  service        text not null check (service in ('hospedagem', 'visita', 'passeio', 'creche', 'especiais')),
  start_date     date not null,
  end_date       date not null,
  pet_name       text not null check (length(pet_name) between 1 and 60),
  species        text not null check (species in ('cao', 'gato', 'outros')),
  pet_size       text not null check (pet_size in ('pequeno', 'medio', 'grande')),
  pet_notes      text check (length(pet_notes) <= 1000),
  message        text check (length(message) <= 1000),
  units          int not null check (units between 1 and 60),
  unit_cents     int not null check (unit_cents >= 0),
  estimated_cents int not null check (estimated_cents >= 0),
  fee_percent    numeric(5,2) not null,
  status         text not null default 'nova'
                   check (status in ('nova', 'em_contato', 'confirmada', 'concluida', 'cancelada')),
  admin_note     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  check (end_date >= start_date)
);
create index care_requests_status_idx on public.care_requests (status, created_at desc);

-- O preço e a comissão são calculados no banco, a partir da vitrine e das configurações.
create or replace function public.request_care(
  p_caregiver uuid, p_service text, p_start date, p_end date,
  p_pet_name text, p_species text, p_size text, p_pet_notes text, p_message text
) returns public.care_requests
language plpgsql security definer set search_path = public as $$
declare
  cg public.caregivers;
  unit int;
  n int;
  fee numeric;
  req public.care_requests;
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  select * into cg from public.caregivers where id = p_caregiver and status = 'aprovado';
  if not found then raise exception 'caregiver_unavailable'; end if;
  if not (p_service = any (cg.services)) then raise exception 'service_unavailable'; end if;
  if p_start < current_date or p_end < p_start or p_end - p_start > 59 then raise exception 'invalid_dates'; end if;

  unit := case p_service
    when 'hospedagem' then cg.price_hosting_cents
    when 'visita' then cg.price_visit_cents
    when 'passeio' then cg.price_walk_cents
    when 'creche' then cg.price_daycare_cents
    else coalesce(cg.price_visit_cents, cg.price_hosting_cents)
  end;
  if unit is null then raise exception 'price_missing'; end if;
  n := greatest(1, p_end - p_start + case when p_service = 'hospedagem' then 0 else 1 end);
  select care_fee_percent into fee from public.platform_settings where id;

  insert into public.care_requests (tutor_id, caregiver_id, service, start_date, end_date, pet_name, species,
                                    pet_size, pet_notes, message, units, unit_cents, estimated_cents, fee_percent)
  values (auth.uid(), cg.id, p_service, p_start, p_end, p_pet_name, p_species, p_size,
          nullif(p_pet_notes, ''), nullif(p_message, ''), n, unit, unit * n, coalesce(fee, 18))
  returning * into req;

  insert into public.notifications (user_id, title, body, link)
  values (auth.uid(), 'Solicitação recebida',
          'Recebemos seu pedido ' || req.code || '. A equipe PetApoio confirma a disponibilidade com o cuidador e responde em até 1 dia útil.',
          '/painel/reservas');
  return req;
end $$;

create or replace function public.notify_care_request_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = old.status then return new; end if;
  new.updated_at := now();
  if new.status = 'confirmada' then
    insert into public.notifications (user_id, title, body, link)
    values (new.tutor_id, 'Reserva confirmada', 'O cuidador confirmou a reserva ' || new.code || '.', '/painel/reservas');
  elsif new.status = 'cancelada' then
    insert into public.notifications (user_id, title, body, link)
    values (new.tutor_id, 'Reserva cancelada', 'A reserva ' || new.code || ' foi cancelada.', '/painel/reservas');
  end if;
  return new;
end $$;
create trigger care_requests_notify before update on public.care_requests
  for each row execute function public.notify_care_request_change();

-- ── PetApoio Saúde: lista do clube de benefícios ─────────────────────────────
create table public.health_leads (
  id            bigint generated always as identity primary key,
  email         citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  city          text check (length(city) <= 80),
  species       text not null check (species in ('cao', 'gato', 'outros')),
  pet_age       text not null check (pet_age in ('filhote', 'adulto', 'idoso')),
  interests     text[] not null check (cardinality(interests) > 0
                  and interests <@ array['prevencao', 'consultas', 'ampla', 'emergencia', 'descontos']),
  budget        text check (budget in ('ate30', '30a90', '90a180', 'acima180', 'nao_sei')),
  consented_at  timestamptz not null default now(),
  unique (email, species, pet_age)
);

-- ── Carteira digital de saúde do pet ─────────────────────────────────────────
create table public.pets (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name        text not null check (length(name) between 1 and 60),
  species     text not null check (species in ('cao', 'gato', 'outros')),
  breed       text check (length(breed) <= 60),
  birth_date  date,
  weight_kg   numeric(5,2) check (weight_kg between 0 and 150),
  notes       text check (length(notes) <= 1000),
  created_at  timestamptz not null default now()
);
create index pets_owner_idx on public.pets (owner_id);

create table public.pet_health_events (
  id           bigint generated always as identity primary key,
  pet_id       uuid not null references public.pets (id) on delete cascade,
  kind         text not null check (kind in ('vacina', 'vermifugo', 'consulta', 'exame', 'medicamento', 'outro')),
  title        text not null check (length(title) between 2 and 120),
  occurred_on  date not null,
  next_due_on  date,
  notes        text check (length(notes) <= 1000),
  created_at   timestamptz not null default now(),
  check (next_due_on is null or next_due_on >= occurred_on)
);
create index pet_health_events_pet_idx on public.pet_health_events (pet_id, occurred_on desc);

-- Números agregados para a administração (sem acesso aos registros de saúde).
create or replace function public.admin_pet_stats()
returns table (pets bigint, owners bigint, events bigint, due_30d bigint, overdue bigint)
language sql stable security definer set search_path = public as $$
  select (select count(*) from public.pets),
         (select count(distinct owner_id) from public.pets),
         (select count(*) from public.pet_health_events),
         (select count(*) from public.pet_health_events where next_due_on between current_date and current_date + 30),
         (select count(*) from public.pet_health_events where next_due_on < current_date)
   where public.is_admin()
$$;


-- Tutores por vertical e quantos usam mais de uma (indicador compartilhado do ecossistema).
create or replace function public.admin_vertical_usage()
returns table (acolhe bigint, cuida bigint, saude bigint, multi bigint, total bigint)
language sql stable security definer set search_path = public as $$
  with u as (
    select patient_id as uid, 'acolhe' as v from public.appointments where status in ('confirmado', 'concluido', 'nao_compareceu')
    union select user_id, 'acolhe' from public.orders where user_id is not null and status not in ('aguardando_pagamento', 'cancelado')
    union select tutor_id, 'cuida' from public.care_requests
    union select owner_id, 'saude' from public.pets
  ), per as (select uid, count(distinct v) as n from u group by uid)
  select (select count(distinct uid) from u where v = 'acolhe'),
         (select count(distinct uid) from u where v = 'cuida'),
         (select count(distinct uid) from u where v = 'saude'),
         (select count(*) from per where n > 1),
         (select count(*) from per)
   where public.is_admin()
$$;

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.caregivers enable row level security;
alter table public.care_requests enable row level security;
alter table public.health_leads enable row level security;
alter table public.pets enable row level security;
alter table public.pet_health_events enable row level security;

-- Candidatura pública: entra sempre como pendente, sem nível nem vitrine.
create policy caregivers_apply on public.caregivers for insert to anon, authenticated with check (
  status = 'pendente' and level = 'cadastrado' and slug is null and approved_at is null and review_note is null
);
create policy caregivers_admin on public.caregivers for all using (public.is_admin()) with check (public.is_admin());

create policy care_requests_tutor_read on public.care_requests for select using (tutor_id = auth.uid() or public.is_admin());
create policy care_requests_admin on public.care_requests for update using (public.is_admin()) with check (public.is_admin());

create policy health_leads_insert on public.health_leads for insert to anon, authenticated with check (true);
create policy health_leads_admin_read on public.health_leads for select using (public.is_admin());

create policy pets_owner on public.pets for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy pet_events_owner on public.pet_health_events for all
  using (exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.pets p where p.id = pet_id and p.owner_id = auth.uid()));

-- ── Privilégios ──────────────────────────────────────────────────────────────
grant select on public.caregiver_directory to anon, authenticated;
revoke insert, update, delete on public.care_requests from anon, authenticated;
grant update on public.care_requests to authenticated; -- só admin passa pela política
revoke execute on function public.request_care(uuid, text, date, date, text, text, text, text, text) from anon, public;
grant execute on function public.request_care(uuid, text, date, date, text, text, text, text, text) to authenticated;
revoke execute on function public.admin_pet_stats() from anon, public;
grant execute on function public.admin_pet_stats() to authenticated;
revoke execute on function public.admin_vertical_usage() from anon, public;
grant execute on function public.admin_vertical_usage() to authenticated;
