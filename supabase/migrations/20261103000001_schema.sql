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
