-- Testes das regras do Cuida e do Saúde. Rode depois de rules_test.sql (usa as contas criadas lá).
\set ON_ERROR_STOP 1
\set QUIET 1
reset role;

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

reset role;
reset request.jwt.claim.sub;

-- Candidatura pública de cuidador
set role anon;
insert into caregivers (full_name, email, phone, neighborhood, services, price_hosting_cents)
values ('Cuidadora Teste', 'c@t.br', '31999990000', 'Buritis', array['hospedagem', 'passeio'], 9000);
select pg_temp.expect_error(
  $$insert into caregivers (full_name, email, phone, neighborhood, services, status) values ('Fura Fila', 'f@t.br', '31999990000', 'Sion', array['passeio'], 'aprovado')$$,
  'row-level security');
select pg_temp.expect_error(
  $$insert into caregivers (full_name, email, phone, neighborhood, services, level) values ('Fura Nivel', 'f@t.br', '31999990000', 'Sion', array['passeio'], 'especializado')$$,
  'row-level security');
select pg_temp.expect_error(
  $$insert into caregivers (full_name, email, phone, neighborhood, services) values ('Serviço Inválido', 'f@t.br', '31999990000', 'Sion', array['tosa'])$$,
  'check constraint');
do $$ begin assert (select count(*) from caregivers) = 0, 'anônimo não lê candidaturas'; raise notice 'ok: candidaturas são privadas'; end $$;
do $$ begin assert (select count(*) from caregiver_directory) = 0, 'pendente não aparece'; raise notice 'ok: pendente fora da vitrine'; end $$;

-- Admin aprova
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
update caregivers set status = 'aprovado', level = 'verificado', slug = 'cuidadora-teste', approved_at = now();
reset role;
reset request.jwt.claim.sub;
set role anon;
do $$ begin
  assert (select count(*) from caregiver_directory) = 1;
  raise notice 'ok: aprovado aparece na vitrine';
end $$;
select pg_temp.expect_error($$select email from caregiver_directory$$, 'does not exist');

-- Solicitação de reserva
select pg_temp.expect_error(
  $$select request_care((select id from caregiver_directory), 'hospedagem', current_date + 3, current_date + 6, 'Mel', 'cao', 'medio', null, null)$$,
  'permission denied');
reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
do $$
declare r care_requests;
begin
  r := request_care((select id from caregiver_directory), 'hospedagem', current_date + 3, current_date + 6, 'Mel', 'cao', 'medio', 'Toma ração especial', 'Posso visitar antes?');
  assert r.units = 3, 'hospedagem conta diárias (noites)';
  assert r.estimated_cents = 27000, 'preço vem da vitrine';
  assert r.fee_percent = 18, 'comissão vem das configurações';
  assert r.status = 'nova';
  raise notice 'ok: solicitação calculada no banco';
end $$;
select pg_temp.expect_error(
  $$select request_care((select id from caregiver_directory), 'creche', current_date + 3, current_date + 3, 'Mel', 'cao', 'medio', null, null)$$,
  'service_unavailable');
select pg_temp.expect_error(
  $$select request_care((select id from caregiver_directory), 'passeio', current_date - 1, current_date, 'Mel', 'cao', 'medio', null, null)$$,
  'invalid_dates');
select pg_temp.expect_error(
  $$select request_care((select id from caregiver_directory), 'passeio', current_date + 1, current_date + 1, 'Mel', 'cao', 'medio', null, null)$$,
  'price_missing');
update care_requests set status = 'confirmada';
do $$ begin assert (select status from care_requests) = 'nova', 'tutor não confirma reserva'; raise notice 'ok: tutor não muda status'; end $$;
select pg_temp.expect_error($$insert into care_requests (tutor_id, caregiver_id, service, start_date, end_date, pet_name, species, pet_size, units, unit_cents, estimated_cents, fee_percent) values (auth.uid(), (select id from caregiver_directory), 'passeio', current_date, current_date, 'x', 'cao', 'medio', 1, 1, 1, 0)$$, 'permission denied');
do $$ begin assert (select count(*) from care_requests) = 1; raise notice 'ok: tutor vê a própria solicitação'; end $$;

set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
do $$ begin assert (select count(*) from care_requests) = 0; raise notice 'ok: outro tutor não vê'; end $$;

-- Admin confirma e o tutor é notificado
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
update care_requests set status = 'confirmada';
reset role;
do $$ begin
  assert (select count(*) from notifications where title = 'Reserva confirmada' and user_id = '00000000-0000-0000-0000-00000000000a') = 1;
  raise notice 'ok: tutor notificado da confirmação';
end $$;

-- Saúde: lista e carteira digital
reset request.jwt.claim.sub;
set role anon;
insert into health_leads (email, city, species, pet_age, interests, budget) values ('s@t.br', 'BH', 'gato', 'idoso', array['prevencao', 'consultas'], '30a90');
insert into interest_signups (email, list) values ('cuida@t.br', 'cuida');
do $$ begin assert (select count(*) from health_leads) = 0; raise notice 'ok: lista de saúde é privada'; end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
insert into pets (name, species) values ('Mel', 'cao');
insert into pet_health_events (pet_id, kind, title, occurred_on, next_due_on)
  select id, 'vacina', 'V10', current_date - 340, current_date + 25 from pets;
select pg_temp.expect_error($$insert into pets (owner_id, name, species) values ('00000000-0000-0000-0000-00000000000d', 'Intruso', 'gato')$$, 'row-level security');

set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000d';
do $$ begin
  assert (select count(*) from pets) = 0 and (select count(*) from pet_health_events) = 0;
  raise notice 'ok: carteira de saúde só do tutor';
end $$;
do $$ begin assert (select count(*) from admin_pet_stats()) = 0; raise notice 'ok: estatística só para admin'; end $$;

set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
do $$ begin
  assert (select count(*) from pets) = 0, 'admin não lê a carteira';
  assert (select pets from admin_pet_stats()) = 1 and (select due_30d from admin_pet_stats()) = 1;
  raise notice 'ok: admin vê só números agregados';
  assert (select cuida from admin_vertical_usage()) = 1 and (select saude from admin_vertical_usage()) = 1;
  assert (select multi from admin_vertical_usage()) >= 1, 'tutor com reserva e pet conta em mais de uma vertical';
  raise notice 'ok: uso por vertical';
end $$;

reset role;
\echo TESTES DO CUIDA E DO SAÚDE PASSARAM
