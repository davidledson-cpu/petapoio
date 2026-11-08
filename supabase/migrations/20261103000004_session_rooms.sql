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
