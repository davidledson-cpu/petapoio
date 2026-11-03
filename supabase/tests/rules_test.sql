-- Testes das regras do banco. Rode após supabase_stub.sql e as migrações.
\set ON_ERROR_STOP 1
\set QUIET 1

create or replace function pg_temp.expect_error(sql text, fragment text) returns void language plpgsql as $$
begin
  execute sql;
  raise exception 'FALHOU: esperava erro contendo "%" em: %', fragment, sql;
exception when others then
  if sqlerrm like 'FALHOU%' then raise; end if;
  if position(fragment in sqlerrm) = 0 then
    raise exception 'FALHOU: erro inesperado "%" (esperava "%")', sqlerrm, fragment;
  end if;
  raise notice 'ok: %', fragment;
end $$;

-- Contas
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'paciente@t.br', '{"full_name":"Paciente","role":"paciente"}'),
  ('00000000-0000-0000-0000-00000000000b', 'psi@t.br',      '{"full_name":"Psicóloga","role":"psicologo"}'),
  ('00000000-0000-0000-0000-00000000000c', 'adm@t.br',      '{"full_name":"Admin","role":"admin"}'),
  ('00000000-0000-0000-0000-00000000000d', 'outro@t.br',    '{"full_name":"Outro"}');

do $$ begin
  assert (select role from profiles where id = '00000000-0000-0000-0000-00000000000c') = 'paciente',
    'cadastro não pode criar admin';
  assert (select role from profiles where id = '00000000-0000-0000-0000-00000000000b') = 'psicologo';
  raise notice 'ok: papéis no cadastro';
end $$;
update profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000c';

-- Psicóloga cria o próprio perfil (pendente)
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
insert into psychologists (id, slug, crp, crp_state, session_price_cents, modality)
values ('00000000-0000-0000-0000-00000000000b', 'psicologa-teste', '06/123456', 'SP', 20000, 'online');
select pg_temp.expect_error($$update psychologists set status = 'aprovado' where id = auth.uid()$$, 'administração');
select pg_temp.expect_error($$update profiles set role = 'admin' where id = auth.uid()$$, 'administração');
insert into availability (psychologist_id, weekday, start_time, end_time)
select auth.uid(), d, '08:00', '20:00' from generate_series(0, 6) d;

-- Paciente não agenda com perfil pendente
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select pg_temp.expect_error($$select book_appointment('00000000-0000-0000-0000-00000000000b', date_trunc('day', now()) + interval '3 days 13 hours')$$, 'não está disponível');
select pg_temp.expect_error($$insert into psychologists (id, crp, crp_state) values (auth.uid(), '1234', 'SP')$$, 'row-level security');
do $$ begin assert (select count(*) from psychologist_directory) = 0; raise notice 'ok: pendente fora do diretório'; end $$;

-- Admin aprova e marca pagamento conectado (o servidor faz isso após o OAuth)
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
update psychologists set status = 'aprovado', mp_connected = true where id = '00000000-0000-0000-0000-00000000000b';
do $$ begin assert (select approved_at is not null from psychologists limit 1); raise notice 'ok: aprovação registra data'; end $$;

-- Paciente agenda
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
do $$ begin assert (select count(*) from psychologist_directory) = 1; raise notice 'ok: aprovado no diretório'; end $$;
select pg_temp.expect_error($$select book_appointment('00000000-0000-0000-0000-00000000000b', now() + interval '1 hour')$$, 'antecedência');
select pg_temp.expect_error($$select book_appointment('00000000-0000-0000-0000-00000000000b', (date_trunc('day', now() at time zone 'America/Sao_Paulo') + interval '3 days 22 hours') at time zone 'America/Sao_Paulo')$$, 'não está na agenda');

create temp table first_appt as
  select * from book_appointment('00000000-0000-0000-0000-00000000000b',
    (date_trunc('day', now() at time zone 'America/Sao_Paulo') + interval '3 days 14 hours') at time zone 'America/Sao_Paulo');
do $$ begin
  assert (select price_cents from first_appt) = 20000;
  assert (select platform_fee_cents from first_appt) = 4000, 'comissão de 20%';
  assert (select status from first_appt) = 'aguardando_pagamento';
  raise notice 'ok: reserva com preço e comissão do banco';
end $$;

-- Outro paciente tenta o mesmo horário
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
select pg_temp.expect_error($$select book_appointment('00000000-0000-0000-0000-00000000000b', (date_trunc('day', now() at time zone 'America/Sao_Paulo') + interval '3 days 14 hours 30 minutes') at time zone 'America/Sao_Paulo')$$, 'acabou de ser reservado');
do $$ begin assert (select count(*) from appointments) = 0, 'outro paciente não vê a sessão'; raise notice 'ok: sessão invisível para terceiros'; end $$;
do $$ begin assert (select count(*) from busy_ranges('00000000-0000-0000-0000-00000000000b', now(), now() + interval '10 days')) = 1; raise notice 'ok: horário ocupado visível sem dados do paciente'; end $$;
select pg_temp.expect_error($$select cancel_appointment((select id from first_appt))$$, 'não tem acesso');
select pg_temp.expect_error($$update appointments set status = 'confirmado'$$, 'permission denied');

-- Paciente não pode confirmar a própria sessão sem pagar
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select pg_temp.expect_error($$insert into appointments (patient_id, psychologist_id, starts_at, ends_at, price_cents, platform_fee_cents, status) values (auth.uid(), '00000000-0000-0000-0000-00000000000b', now() + interval '5 days', now() + interval '5 days 50 minutes', 1, 0, 'confirmado')$$, 'permission denied');

-- Servidor confirma o pagamento (webhook com service_role)
reset role;
update appointments set status = 'confirmado', paid_at = now() where id = (select id from first_appt);
do $$ begin assert (select count(*) from notifications) = 2; raise notice 'ok: notificações de confirmação'; end $$;

-- Psicóloga não registra sessão futura
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select pg_temp.expect_error($$select finish_appointment((select id from first_appt), 'concluido')$$, 'já começaram');
do $$ begin assert (select count(*) from profiles) = 2, 'psicóloga vê a si e ao paciente'; raise notice 'ok: psicóloga vê só seus pacientes'; end $$;

-- Paciente cancela
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
do $$ begin assert (select status from cancel_appointment((select id from first_appt))) = 'cancelado'; raise notice 'ok: cancelamento'; end $$;

-- Hold expirado libera o horário
reset role;
update appointments set status = 'aguardando_pagamento', hold_expires_at = now() - interval '1 minute', cancelled_by = null where id = (select id from first_appt);
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
do $$ begin
  perform book_appointment('00000000-0000-0000-0000-00000000000b',
    (date_trunc('day', now() at time zone 'America/Sao_Paulo') + interval '3 days 14 hours') at time zone 'America/Sao_Paulo');
  raise notice 'ok: reserva expirada libera o horário';
end $$;

-- Loja
reset role;
insert into products (slug, name, category, summary, price_cents, needs_name) values
  ('quadro-teste', 'Quadro teste', 'memorias', 'Resumo', 15000, true),
  ('caderno-teste', 'Caderno teste', 'acolhimento', 'Resumo', 6000, false);
set role anon;
set request.jwt.claim.sub = '';
do $$ begin assert (select count(*) from products) = 2; raise notice 'ok: catálogo público'; end $$;
select pg_temp.expect_error($$update products set price_cents = 1$$, 'permission denied');
select pg_temp.expect_error($$select create_order(jsonb_build_array(jsonb_build_object('product_id', (select id from products where slug='quadro-teste'), 'quantity', 1)), 'a@b.com', 'Ana Teste', '', '{"cep":"30110-000"}')$$, 'Informe o nome');
create temp table ord as select * from create_order(
  jsonb_build_array(
    jsonb_build_object('product_id', (select id from products where slug='quadro-teste'), 'quantity', 1, 'name', 'Thor', 'price_cents', 1),
    jsonb_build_object('product_id', (select id from products where slug='caderno-teste'), 'quantity', 2)),
  'a@b.com', 'Ana Teste', '', '{"cep":"30110-000"}');
do $$ begin
  assert (select subtotal_cents from ord) = 27000, 'preço vem do banco, não do carrinho';
  assert (select shipping_cents from ord) = 0, 'frete grátis acima de R$ 250';
  raise notice 'ok: pedido com preços do banco e frete';
end $$;
do $$ begin assert (select count(*) from orders) = 0; raise notice 'ok: pedidos não são públicos'; end $$;
select pg_temp.expect_error($$insert into interest_signups (email, list) values ('x', 'newsletter')$$, 'check constraint');
insert into interest_signups (email, list) values ('x@y.com', 'newsletter');
select pg_temp.expect_error($$select * from psychologist_payment_accounts$$, 'permission denied');

\echo TODOS OS TESTES PASSARAM
