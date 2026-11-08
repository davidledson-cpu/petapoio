-- PetApoio Saúde: interesse por produto na lista de espera (Saúde, Protege, Despedida ou combo).
alter table public.health_leads
  add column if not exists products text[] not null default '{}'
  check (products <@ array['saude', 'protege', 'despedida', 'combo']);
