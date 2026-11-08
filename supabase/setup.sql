-- Script único com todas as migrações, para colar no SQL Editor do Supabase. Gerado a partir de supabase/migrations.
-- PetApoio — schema da plataforma
-- Contas e papéis, psicólogos, disponibilidade, agendamentos com split de pagamento,
-- loja (produtos e pedidos), notificações e listas de e-mail.
--
-- Princípios:
--   * RLS em todas as tabelas. Nada é legível publicamente sem política explícita.
--   * Mudanças sensíveis (status, preço cobrado, pagamento) só por funções SECURITY DEFINER
--     ou pelo servidor com a chave service_role, nunca direto pelo navegador.
--   * Minimização: não guardamos relatos de luto nem dados clínicos.

create extension if not exists citext;
create extension if not exists btree_gist;

-- ─────────────────────────────────────────────────────────────────────────────
-- Configurações da plataforma (uma linha)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.platform_settings (
  id                     boolean primary key default true check (id),
  platform_fee_percent   numeric(5,2) not null default 20 check (platform_fee_percent between 0 and 50),
  booking_hold_minutes   int not null default 30 check (booking_hold_minutes between 5 and 120),
  min_notice_hours       int not null default 12 check (min_notice_hours between 0 and 168),
  cancel_refund_hours    int not null default 24 check (cancel_refund_hours between 0 and 168),
  shipping_flat_cents    int not null default 2490 check (shipping_flat_cents >= 0),
  free_shipping_from_cents int not null default 25000 check (free_shipping_from_cents >= 0),
  updated_at             timestamptz not null default now()
);
insert into public.platform_settings default values;

-- ─────────────────────────────────────────────────────────────────────────────
-- Perfis e papéis
-- ─────────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'paciente' check (role in ('paciente', 'psicologo', 'admin')),
  full_name   text not null default '' check (length(full_name) <= 120),
  phone       text check (length(phone) <= 30),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- Cria o perfil quando a conta é criada. O papel vem do cadastro, mas nunca pode ser "admin".
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  wanted text := coalesce(new.raw_user_meta_data ->> 'role', 'paciente');
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    case when wanted = 'psicologo' then 'psicologo' else 'paciente' end,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120),
    left(new.raw_user_meta_data ->> 'phone', 30)
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Usuário comum não pode mudar o próprio papel.
-- SECURITY INVOKER de propósito: current_user precisa ser quem fez a alteração.
create or replace function public.protect_profile_role()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin()
     and current_user not in ('service_role', 'postgres', 'supabase_admin') then
    raise exception 'Somente a administração pode alterar o papel de uma conta.';
  end if;
  new.updated_at := now();
  return new;
end $$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ─────────────────────────────────────────────────────────────────────────────
-- Psicólogos
-- ─────────────────────────────────────────────────────────────────────────────
create table public.psychologists (
  id                    uuid primary key references public.profiles (id) on delete cascade,
  slug                  text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status                text not null default 'pendente'
                        check (status in ('pendente', 'aprovado', 'recusado', 'suspenso')),
  review_note           text check (length(review_note) <= 1000),
  crp                   text not null check (length(crp) between 4 and 20),
  crp_state             char(2) not null,
  headline              text check (length(headline) <= 140),
  bio                   text check (length(bio) <= 3000),
  education             text check (length(education) <= 1500),
  approach              text check (length(approach) <= 120),
  specialties           text[] not null default '{}',
  pet_grief_experience  boolean not null default false,
  serves_children       boolean not null default false,
  serves_families       boolean not null default false,
  modality              text not null default 'online' check (modality in ('online', 'presencial', 'ambos')),
  city                  text check (length(city) <= 80),
  state                 char(2),
  languages             text[] not null default '{Português}',
  session_price_cents   int check (session_price_cents between 5000 and 100000),
  session_minutes       int not null default 50 check (session_minutes between 30 and 120),
  meeting_url           text check (meeting_url is null or meeting_url ~ '^https://'),
  photo_path            text,     -- bucket público "avatars"
  document_path         text,     -- bucket privado "documents" (CRP / identidade)
  mp_connected          boolean not null default false,
  accepted_terms_at     timestamptz,
  approved_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index psychologists_status_idx on public.psychologists (status);

-- O psicólogo edita o próprio perfil, mas não pode se aprovar nem marcar o Mercado Pago como conectado.
-- SECURITY INVOKER de propósito: current_user precisa ser quem fez a alteração.
create or replace function public.protect_psychologist_fields()
returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('service_role', 'postgres', 'supabase_admin') or public.is_admin() then
    if new.status = 'aprovado' and old.status is distinct from 'aprovado' then
      new.approved_at := now();
    end if;
  else
    if new.status is distinct from old.status
       or new.review_note is distinct from old.review_note
       or new.mp_connected is distinct from old.mp_connected
       or new.approved_at is distinct from old.approved_at
       or new.crp is distinct from old.crp
       or new.crp_state is distinct from old.crp_state then
      raise exception 'Este campo só pode ser alterado pela administração.';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;

create trigger psychologists_protect
  before update on public.psychologists
  for each row execute function public.protect_psychologist_fields();

-- Contas Mercado Pago conectadas (OAuth do split). Tokens criptografados pela aplicação.
-- Sem nenhuma política RLS: só o servidor, com service_role, lê ou grava.
create table public.psychologist_payment_accounts (
  psychologist_id         uuid primary key references public.psychologists (id) on delete cascade,
  mp_user_id              text not null,
  access_token_enc        text not null,
  refresh_token_enc       text not null,
  expires_at              timestamptz not null,
  connected_at            timestamptz not null default now()
);

-- Horários semanais recorrentes (hora local de São Paulo).
create table public.availability (
  id               bigint generated always as identity primary key,
  psychologist_id  uuid not null references public.psychologists (id) on delete cascade,
  weekday          smallint not null check (weekday between 0 and 6),  -- 0 = domingo
  start_time       time not null,
  end_time         time not null,
  check (end_time > start_time)
);
create index availability_psych_idx on public.availability (psychologist_id, weekday);

-- Folgas e bloqueios pontuais.
create table public.time_off (
  id               bigint generated always as identity primary key,
  psychologist_id  uuid not null references public.psychologists (id) on delete cascade,
  starts_at        timestamptz not null,
  ends_at          timestamptz not null,
  reason           text check (length(reason) <= 120),
  check (ends_at > starts_at)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Agendamentos (pagamento com split via Mercado Pago)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.appointments (
  id                   uuid primary key default gen_random_uuid(),
  patient_id           uuid not null references public.profiles (id) on delete restrict,
  psychologist_id      uuid not null references public.psychologists (id) on delete restrict,
  starts_at            timestamptz not null,
  ends_at              timestamptz not null,
  status               text not null default 'aguardando_pagamento'
                       check (status in ('aguardando_pagamento', 'confirmado', 'cancelado', 'concluido', 'nao_compareceu', 'expirado')),
  price_cents          int not null check (price_cents > 0),
  platform_fee_cents   int not null check (platform_fee_cents >= 0),
  hold_expires_at      timestamptz,
  mp_preference_id     text,
  mp_payment_id        text,
  paid_at              timestamptz,
  refunded_at          timestamptz,
  cancelled_by         text check (cancelled_by in ('paciente', 'psicologo', 'admin', 'sistema')),
  cancelled_at         timestamptz,
  created_at           timestamptz not null default now(),
  check (ends_at > starts_at),
  check (platform_fee_cents <= price_cents)
);

-- Impede dois horários sobrepostos para o mesmo psicólogo (exceto cancelados/expirados).
alter table public.appointments add constraint appointments_no_overlap
  exclude using gist (
    psychologist_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('aguardando_pagamento', 'confirmado', 'concluido', 'nao_compareceu'));

create index appointments_patient_idx on public.appointments (patient_id, starts_at desc);
create index appointments_psych_idx on public.appointments (psychologist_id, starts_at);

-- Libera horários reservados e não pagos.
create or replace function public.expire_stale_holds()
returns void language sql security definer set search_path = public as $$
  update public.appointments
     set status = 'expirado', cancelled_by = 'sistema', cancelled_at = now()
   where status = 'aguardando_pagamento' and hold_expires_at < now();
$$;

-- Reserva um horário. Valida disponibilidade, antecedência e preço no banco, não no navegador.
create or replace function public.book_appointment(p_psychologist uuid, p_starts_at timestamptz)
returns public.appointments
language plpgsql security definer set search_path = public as $$
declare
  ps   public.psychologists;
  cfg  public.platform_settings;
  local_start timestamp;
  ends timestamptz;
  appt public.appointments;
begin
  if auth.uid() is null then
    raise exception 'Entre na sua conta para agendar.' using errcode = '28000';
  end if;
  if auth.uid() = p_psychologist then
    raise exception 'Você não pode agendar uma sessão consigo mesmo.';
  end if;

  perform public.expire_stale_holds();

  select * into ps from public.psychologists where id = p_psychologist;
  if ps.id is null or ps.status <> 'aprovado' then
    raise exception 'Este profissional não está disponível para agendamentos.';
  end if;
  if not ps.mp_connected or ps.session_price_cents is null then
    raise exception 'Este profissional ainda não ativou os pagamentos.';
  end if;

  select * into cfg from public.platform_settings;
  if p_starts_at < now() + make_interval(hours => cfg.min_notice_hours) then
    raise exception 'Escolha um horário com pelo menos % horas de antecedência.', cfg.min_notice_hours;
  end if;
  if p_starts_at > now() + interval '90 days' then
    raise exception 'A agenda está aberta para os próximos 90 dias.';
  end if;

  ends := p_starts_at + make_interval(mins => ps.session_minutes);
  local_start := p_starts_at at time zone 'America/Sao_Paulo';

  if not exists (
    select 1 from public.availability a
     where a.psychologist_id = ps.id
       and a.weekday = extract(dow from local_start)
       and a.start_time <= local_start::time
       and a.end_time >= (ends at time zone 'America/Sao_Paulo')::time
  ) then
    raise exception 'Este horário não está na agenda do profissional.';
  end if;

  if exists (
    select 1 from public.time_off t
     where t.psychologist_id = ps.id
       and tstzrange(t.starts_at, t.ends_at) && tstzrange(p_starts_at, ends)
  ) then
    raise exception 'O profissional não atende neste horário.';
  end if;

  begin
    insert into public.appointments (patient_id, psychologist_id, starts_at, ends_at, price_cents,
                                     platform_fee_cents, hold_expires_at)
    values (auth.uid(), ps.id, p_starts_at, ends, ps.session_price_cents,
            round(ps.session_price_cents * cfg.platform_fee_percent / 100),
            now() + make_interval(mins => cfg.booking_hold_minutes))
    returning * into appt;
  exception when exclusion_violation then
    raise exception 'Este horário acabou de ser reservado. Escolha outro.';
  end;

  return appt;
end $$;

-- Horários ocupados de um psicólogo (sem expor quem agendou).
create or replace function public.busy_ranges(p_psychologist uuid, p_from timestamptz, p_to timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.starts_at, a.ends_at from public.appointments a
   where a.psychologist_id = p_psychologist
     and a.starts_at < p_to and a.ends_at > p_from
     and (a.status in ('confirmado', 'concluido', 'nao_compareceu')
          or (a.status = 'aguardando_pagamento' and a.hold_expires_at > now()))
  union all
  select t.starts_at, t.ends_at from public.time_off t
   where t.psychologist_id = p_psychologist and t.starts_at < p_to and t.ends_at > p_from
$$;

-- Cancelamento pelo paciente, psicólogo ou admin. Reembolso é tratado pelo servidor.
create or replace function public.cancel_appointment(p_id uuid)
returns public.appointments
language plpgsql security definer set search_path = public as $$
declare
  appt public.appointments;
  who  text;
begin
  select * into appt from public.appointments where id = p_id for update;
  if appt.id is null then raise exception 'Agendamento não encontrado.'; end if;

  who := case
    when public.is_admin() then 'admin'
    when appt.patient_id = auth.uid() then 'paciente'
    when appt.psychologist_id = auth.uid() then 'psicologo'
  end;
  if who is null then raise exception 'Você não tem acesso a este agendamento.'; end if;
  if appt.status not in ('aguardando_pagamento', 'confirmado') then
    raise exception 'Este agendamento não pode mais ser cancelado.';
  end if;
  if appt.starts_at < now() then
    raise exception 'A sessão já começou ou já passou.';
  end if;

  update public.appointments
     set status = 'cancelado', cancelled_by = who, cancelled_at = now()
   where id = p_id
   returning * into appt;
  return appt;
end $$;

-- O psicólogo registra o resultado da sessão.
create or replace function public.finish_appointment(p_id uuid, p_status text)
returns public.appointments
language plpgsql security definer set search_path = public as $$
declare appt public.appointments;
begin
  if p_status not in ('concluido', 'nao_compareceu') then
    raise exception 'Status inválido.';
  end if;
  select * into appt from public.appointments where id = p_id for update;
  if appt.id is null or (appt.psychologist_id <> auth.uid() and not public.is_admin()) then
    raise exception 'Você não tem acesso a este agendamento.';
  end if;
  if appt.status <> 'confirmado' or appt.starts_at > now() then
    raise exception 'Só é possível registrar sessões confirmadas que já começaram.';
  end if;
  update public.appointments set status = p_status where id = p_id returning * into appt;
  return appt;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Loja
-- ─────────────────────────────────────────────────────────────────────────────
create table public.products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name               text not null check (length(name) between 3 and 100),
  category           text not null check (category in ('memorias', 'lembrancas', 'acolhimento', 'presentes')),
  summary            text not null check (length(summary) <= 200),
  description        text not null default '' check (length(description) <= 4000),
  price_cents        int not null check (price_cents > 0),
  production_days    int not null default 7 check (production_days between 0 and 60),
  needs_photo        boolean not null default false,
  needs_name         boolean not null default false,
  images             text[] not null default '{}',   -- caminhos em /public ou no bucket "products"
  active             boolean not null default true,
  sort_order         int not null default 100,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.orders (
  id                 uuid primary key default gen_random_uuid(),
  code               text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  user_id            uuid references public.profiles (id) on delete set null,
  email              citext not null,
  full_name          text not null check (length(full_name) between 3 and 120),
  phone              text check (length(phone) <= 30),
  address            jsonb not null,
  subtotal_cents     int not null check (subtotal_cents >= 0),
  shipping_cents     int not null check (shipping_cents >= 0),
  total_cents        int not null check (total_cents > 0),
  status             text not null default 'aguardando_pagamento'
                     check (status in ('aguardando_pagamento', 'pago', 'em_producao', 'enviado', 'entregue', 'cancelado')),
  tracking_code      text check (length(tracking_code) <= 60),
  mp_preference_id   text,
  mp_payment_id      text,
  paid_at            timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id                 bigint generated always as identity primary key,
  order_id           uuid not null references public.orders (id) on delete cascade,
  product_id         uuid references public.products (id) on delete set null,
  product_name       text not null,
  unit_price_cents   int not null check (unit_price_cents > 0),
  quantity           int not null check (quantity between 1 and 10),
  personalization_name text check (length(personalization_name) <= 60),
  personalization_photo text   -- caminho no bucket privado "order-uploads"
);

-- Cria o pedido com preços lidos do banco (nunca do navegador).
-- p_items: [{"product_id": uuid, "quantity": int, "name": text?, "photo": text?}]
create or replace function public.create_order(
  p_items jsonb, p_email text, p_full_name text, p_phone text, p_address jsonb
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare
  cfg   public.platform_settings;
  ord   public.orders;
  item  jsonb;
  prod  public.products;
  qty   int;
  subtotal int := 0;
  ship  int;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 20 then
    raise exception 'O carrinho está vazio.';
  end if;
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Confira o e-mail.'; end if;
  if coalesce(p_address ->> 'cep', '') !~ '^\d{5}-?\d{3}$' then raise exception 'Confira o CEP.'; end if;

  select * into cfg from public.platform_settings;

  for item in select * from jsonb_array_elements(p_items) loop
    select * into prod from public.products where id = (item ->> 'product_id')::uuid and active;
    if prod.id is null then raise exception 'Um dos produtos não está mais disponível.'; end if;
    qty := greatest(1, least(10, coalesce((item ->> 'quantity')::int, 1)));
    if prod.needs_name and coalesce(trim(item ->> 'name'), '') = '' then
      raise exception 'Informe o nome para personalizar "%".', prod.name;
    end if;
    if prod.needs_photo and coalesce(item ->> 'photo', '') = '' then
      raise exception 'Envie a foto para personalizar "%".', prod.name;
    end if;
    subtotal := subtotal + prod.price_cents * qty;
  end loop;

  ship := case when subtotal >= cfg.free_shipping_from_cents then 0 else cfg.shipping_flat_cents end;

  insert into public.orders (user_id, email, full_name, phone, address, subtotal_cents, shipping_cents, total_cents)
  values (auth.uid(), lower(trim(p_email)), trim(p_full_name), nullif(trim(p_phone), ''), p_address,
          subtotal, ship, subtotal + ship)
  returning * into ord;

  for item in select * from jsonb_array_elements(p_items) loop
    select * into prod from public.products where id = (item ->> 'product_id')::uuid;
    insert into public.order_items (order_id, product_id, product_name, unit_price_cents, quantity,
                                    personalization_name, personalization_photo)
    values (ord.id, prod.id, prod.name, prod.price_cents,
            greatest(1, least(10, coalesce((item ->> 'quantity')::int, 1))),
            nullif(left(trim(item ->> 'name'), 60), ''), nullif(item ->> 'photo', ''));
  end loop;

  return ord;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Notificações e listas de e-mail
-- ─────────────────────────────────────────────────────────────────────────────
create table public.notifications (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  body        text,
  link        text,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.interest_signups (
  id           bigint generated always as identity primary key,
  email        citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  list         text not null check (list in ('newsletter', 'psicologos', 'loja')),
  consented_at timestamptz not null default now(),
  unique (email, list)
);

-- Notifica as partes quando um agendamento muda de status.
create or replace function public.notify_appointment_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  when_txt text := to_char(new.starts_at at time zone 'America/Sao_Paulo', 'DD/MM "às" HH24:MI');
begin
  if new.status = old.status then return new; end if;
  if new.status = 'confirmado' then
    insert into public.notifications (user_id, title, body, link) values
      (new.patient_id, 'Sessão confirmada', 'Sua sessão de ' || when_txt || ' está confirmada.', '/painel/sessoes'),
      (new.psychologist_id, 'Nova sessão agendada', 'Sessão confirmada para ' || when_txt || '.', '/painel/psicologo/agenda');
  elsif new.status = 'cancelado' then
    insert into public.notifications (user_id, title, body, link) values
      (new.patient_id, 'Sessão cancelada', 'A sessão de ' || when_txt || ' foi cancelada.', '/painel/sessoes'),
      (new.psychologist_id, 'Sessão cancelada', 'A sessão de ' || when_txt || ' foi cancelada.', '/painel/psicologo/agenda');
  end if;
  return new;
end $$;

create trigger appointments_notify
  after update of status on public.appointments
  for each row execute function public.notify_appointment_change();

-- ─────────────────────────────────────────────────────────────────────────────
-- Diretório público (somente aprovados, só campos públicos)
-- ─────────────────────────────────────────────────────────────────────────────
create view public.psychologist_directory
with (security_invoker = false) as
  select ps.id, ps.slug, pr.full_name, ps.crp, ps.crp_state, ps.headline, ps.bio, ps.education,
         ps.approach, ps.specialties, ps.pet_grief_experience, ps.serves_children, ps.serves_families,
         ps.modality, ps.city, ps.state, ps.languages, ps.session_price_cents, ps.session_minutes,
         ps.photo_path, ps.mp_connected, ps.approved_at
    from public.psychologists ps
    join public.profiles pr on pr.id = ps.id
   where ps.status = 'aprovado';

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.platform_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.psychologists enable row level security;
alter table public.psychologist_payment_accounts enable row level security;
alter table public.availability enable row level security;
alter table public.time_off enable row level security;
alter table public.appointments enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.notifications enable row level security;
alter table public.interest_signups enable row level security;

create policy settings_read on public.platform_settings for select using (true);
create policy settings_admin on public.platform_settings for update using (public.is_admin());

create policy profiles_self_read on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_self_update on public.profiles for update using (id = auth.uid() or public.is_admin());
-- O psicólogo vê o nome dos pacientes com quem tem sessão.
create policy profiles_psych_sees_patients on public.profiles for select using (
  exists (select 1 from public.appointments a where a.patient_id = profiles.id and a.psychologist_id = auth.uid())
);

create policy psych_self_read on public.psychologists for select using (id = auth.uid() or public.is_admin());
create policy psych_self_insert on public.psychologists for insert with check (
  id = auth.uid() and status = 'pendente' and not mp_connected
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'psicologo')
);
create policy psych_self_update on public.psychologists for update using (id = auth.uid() or public.is_admin());

create policy availability_public_read on public.availability for select using (
  exists (select 1 from public.psychologists p where p.id = psychologist_id and p.status = 'aprovado')
  or psychologist_id = auth.uid() or public.is_admin()
);
create policy availability_owner_write on public.availability for all
  using (psychologist_id = auth.uid() or public.is_admin())
  with check (psychologist_id = auth.uid() or public.is_admin());

create policy time_off_owner on public.time_off for all
  using (psychologist_id = auth.uid() or public.is_admin())
  with check (psychologist_id = auth.uid() or public.is_admin());

-- Agendamentos: leitura pelas partes; escrita só pelas funções acima ou pelo servidor.
create policy appointments_parties_read on public.appointments for select using (
  patient_id = auth.uid() or psychologist_id = auth.uid() or public.is_admin()
);

create policy products_public_read on public.products for select using (active or public.is_admin());
create policy products_admin_write on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy orders_owner_read on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy orders_admin_update on public.orders for update using (public.is_admin());
create policy order_items_read on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

create policy notifications_own on public.notifications for select using (user_id = auth.uid());
create policy notifications_mark_read on public.notifications for update using (user_id = auth.uid());

create policy signups_insert on public.interest_signups for insert to anon, authenticated with check (true);
create policy signups_admin_read on public.interest_signups for select using (public.is_admin());

-- Privilégios
revoke all on public.psychologist_payment_accounts from anon, authenticated;
grant select on public.psychologist_directory to anon, authenticated;
revoke execute on function public.book_appointment(uuid, timestamptz) from anon, public;
grant execute on function public.book_appointment(uuid, timestamptz) to authenticated;
revoke execute on function public.cancel_appointment(uuid) from anon, public;
grant execute on function public.cancel_appointment(uuid) to authenticated;
revoke execute on function public.finish_appointment(uuid, text) from anon, public;
grant execute on function public.finish_appointment(uuid, text) to authenticated;
grant execute on function public.busy_ranges(uuid, timestamptz, timestamptz) to anon, authenticated;
grant execute on function public.create_order(jsonb, text, text, text, jsonb) to anon, authenticated;
revoke execute on function public.expire_stale_holds() from anon, authenticated, public;

-- Defesa em profundidade: o navegador nunca grava diretamente nestas tabelas.
revoke insert, update, delete on public.appointments from anon, authenticated;
revoke insert, delete on public.orders from anon, authenticated;
revoke insert, update, delete on public.order_items from anon, authenticated;
revoke insert, delete on public.notifications from anon, authenticated;
revoke insert, delete on public.profiles from anon, authenticated;
revoke insert, delete on public.platform_settings from anon, authenticated;
revoke delete on public.psychologists from anon, authenticated;
revoke insert, update, delete on public.products, public.psychologists, public.availability, public.time_off from anon;

-- Buckets de arquivos
--   avatars        público  — fotos dos psicólogos       (pasta = id do psicólogo)
--   documents      privado  — CRP e documentos de verificação (pasta = id do psicólogo)
--   products       público  — fotos dos produtos da loja (só admin envia)
--   order-uploads  privado  — fotos enviadas para personalizar pedidos

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 10485760, array['image/jpeg', 'image/png', 'application/pdf']),
  ('products', 'products', true, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('order-uploads', 'order-uploads', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do nothing;

-- Foto do psicólogo: cada um escreve só na própria pasta.
create policy avatars_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Documentos: o dono envia e lê; admin lê. Ninguém mais.
create policy documents_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy documents_owner_read on storage.objects for select to authenticated
  using (bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- Produtos: só admin gerencia.
create policy products_admin_write on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and public.is_admin());
create policy products_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'products' and public.is_admin());
create policy products_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'products' and public.is_admin());

-- Fotos de personalização: o envio é feito pelo servidor (service_role) com URL assinada;
-- leitura só pela administração.
create policy order_uploads_admin_read on storage.objects for select to authenticated
  using (bucket_id = 'order-uploads' and public.is_admin());

-- Catálogo inicial da loja PetApoio: lembranças e homenagens feitas sob encomenda.
-- As imagens em /produtos/* são ilustrações de referência; substitua por fotos reais no painel admin.

insert into public.products
  (slug, name, category, summary, description, price_cents, production_days, needs_photo, needs_name, images, sort_order)
values
  ('retrato-ilustrado', 'Retrato ilustrado do seu pet', 'memorias',
   'Uma ilustração feita à mão a partir da foto que você escolher, emoldurada em madeira.',
   E'Você envia uma foto em que reconhece o jeito do seu companheiro, e uma ilustradora transforma essa imagem em um retrato delicado, em tons suaves.\n\nAntes de produzir, enviamos uma prévia por e-mail para você aprovar. Se algo não parecer com ele, ajustamos.\n\nTamanho: 30 × 40 cm, com moldura de madeira clara e paspatur.',
   18900, 12, true, false, '{/produtos/retrato-ilustrado-1.webp,/produtos/retrato-ilustrado-2.webp}', 10),

  ('quadro-foto-nome', 'Quadro com foto e nome', 'memorias',
   'Sua foto preferida, com o nome e os anos que vocês passaram juntos.',
   E'Um quadro simples para um lugar especial da casa. Imprimimos a foto em papel fotográfico fosco e gravamos o nome e as datas logo abaixo.\n\nSe preferir, deixe as datas em branco: só o nome já basta.\n\nTamanho: 21 × 30 cm, moldura grafite.',
   12900, 7, true, true, '{/produtos/quadro-foto-nome-1.webp}', 20),

  ('caixa-recordacoes', 'Caixa de recordações em madeira', 'memorias',
   'Um lugar para guardar a coleira, o brinquedo preferido e as pequenas lembranças.',
   E'Feita em madeira de reflorestamento, com o nome gravado na tampa e uma frase curta, se você quiser.\n\nMuitas pessoas não sabem o que fazer com os objetos do pet. Guardá-los com cuidado pode ser uma forma de manter essa história por perto, no seu tempo.\n\nMedidas internas: 28 × 20 × 12 cm.',
   16900, 10, false, true, '{/produtos/caixa-recordacoes-1.webp,/produtos/caixa-recordacoes-2.webp}', 30),

  ('livro-de-memorias', 'Livro de memórias com fotos', 'memorias',
   'Um livro de capa dura com as fotos e histórias de vocês, montado com você.',
   E'Você envia uma foto agora e, depois da compra, combinamos por e-mail as outras imagens e os pequenos textos que quiser incluir.\n\nNão há pressa: o livro só entra em produção quando você aprovar a prévia.\n\n24 páginas, capa dura em tecido, 21 × 21 cm.',
   23900, 15, true, false, '{/produtos/livro-memorias-1.webp,/produtos/livro-memorias-2.webp}', 40),

  ('pingente-gravado', 'Pingente com nome gravado', 'lembrancas',
   'Um pingente em prata 925 para levar o nome dele sempre com você.',
   E'Pingente redondo de 2 cm em prata 925, com corrente de 45 cm. Gravamos o nome à mão, em letra cursiva, e um pequeno coração.\n\nAcompanha uma bolsinha de algodão para guardar.',
   14900, 7, false, true, '{/produtos/pingente-gravado-1.webp}', 50),

  ('placa-memorial-jardim', 'Placa memorial para jardim', 'lembrancas',
   'Uma placa em cerâmica resistente ao tempo, para o jardim ou para um vaso.',
   E'Para quem gosta de ter um cantinho de lembrança ao ar livre. A placa é feita em cerâmica esmaltada, resistente ao sol e à chuva, com o nome e uma frase curta gravados.\n\nTamanho: 20 × 14 cm, com haste para fixar na terra.',
   11900, 10, false, true, '{/produtos/placa-jardim-1.webp}', 60),

  ('porta-retrato-madeira', 'Porta-retrato de madeira', 'lembrancas',
   'Um porta-retrato simples, de madeira maciça, para a foto que você quiser.',
   E'Feito em madeira maciça com acabamento natural, para fotos de 10 × 15 cm. Pode ficar em pé na mesa ou pendurado na parede.\n\nSe quiser que a gente imprima a foto, responda o e-mail de confirmação do pedido com a imagem.',
   6900, 5, false, false, '{/produtos/porta-retrato-1.webp}', 70),

  ('caderno-de-memorias', 'Caderno de memórias', 'acolhimento',
   'Um caderno com perguntas delicadas para escrever sobre ele, no seu ritmo.',
   E'Escrever pode ajudar a organizar o que se sente. Este caderno traz algumas perguntas gentis, como "do que eu mais sinto falta" ou "um dia que quero lembrar", e muitas páginas livres.\n\nFoi pensado com orientação de uma psicóloga e não substitui acompanhamento profissional.\n\nCapa em tecido de linho com o nome gravado, 120 páginas, 15 × 21 cm.',
   7900, 5, false, true, '{/produtos/caderno-memorias-1.webp,/produtos/caderno-memorias-2.webp}', 80),

  ('cartoes-de-acolhimento', 'Cartões de acolhimento', 'presentes',
   'Três cartões com mensagens cuidadosas para quem perdeu um pet.',
   E'Às vezes é difícil encontrar as palavras. Os cartões trazem frases simples, que reconhecem a perda sem minimizar a dor, e espaço para você escrever.\n\nConjunto com 3 cartões de 12 × 17 cm e envelopes.',
   3900, 3, false, false, '{/produtos/cartoes-acolhimento-1.webp}', 90),

  ('kit-acolhimento', 'Kit acolhimento', 'presentes',
   'Caderno de memórias, cartão escrito por você e sementes para plantar.',
   E'Um presente para mostrar a alguém que você se importa. O kit reúne o caderno de memórias com o nome do pet, um cartão com a sua mensagem (escrita à mão pela nossa equipe) e um pacote de sementes de girassol.\n\nEnviamos direto para a pessoa, se você preferir. É só informar o endereço dela no pedido.',
   14900, 7, false, true, '{/produtos/kit-acolhimento-1.webp}', 100)
on conflict (slug) do nothing;

-- Link da videochamada: o paciente só vê o link das próprias sessões confirmadas.
create or replace function public.my_session_rooms()
returns table (appointment_id uuid, meeting_url text)
language sql stable security definer set search_path = public as $$
  select a.id, ps.meeting_url
    from public.appointments a
    join public.psychologists ps on ps.id = a.psychologist_id
   where a.patient_id = auth.uid() and a.status = 'confirmado'
$$;
revoke execute on function public.my_session_rooms() from anon, public;
grant execute on function public.my_session_rooms() to authenticated;

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

-- PetApoio Saúde: interesse por produto na lista de espera (Saúde, Protege, Despedida ou combo).
alter table public.health_leads
  add column if not exists products text[] not null default '{}'
  check (products <@ array['saude', 'protege', 'despedida', 'combo']);
