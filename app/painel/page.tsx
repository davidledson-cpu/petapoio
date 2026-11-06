import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PanelHeader, EmptyState, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { APPOINTMENT_STATUS, dateTime } from '@/lib/format'
import { dueLabel, isoInDays } from '@/lib/saude'

export default async function PainelPage() {
  const { profile, userId } = await requireSession()
  if (profile.role === 'psicologo') redirect('/painel/psicologo')
  const supabase = await createClient()
  const { data: next } = await supabase
    .from('appointments')
    .select('id, starts_at, status, psychologist_id')
    .eq('patient_id', userId)
    .in('status', ['confirmado', 'aguardando_pagamento'])
    .gte('ends_at', new Date().toISOString())
    .order('starts_at')
    .limit(3)

  // Só aparece para quem usa o Cuida ou o Saúde; quem chegou pelo luto não vê nada disso.
  const soon = isoInDays(30)
  const [{ data: pets }, { count: openCare }] = await Promise.all([
    supabase.from('pets').select('id, name').eq('owner_id', userId),
    supabase.from('care_requests').select('*', { count: 'exact', head: true }).eq('tutor_id', userId).in('status', ['nova', 'em_contato', 'confirmada']),
  ])
  const { data: reminders } = pets && pets.length
    ? await supabase.from('pet_health_events').select('id, pet_id, title, next_due_on').in('pet_id', pets.map((p) => p.id)).not('next_due_on', 'is', null).lte('next_due_on', soon).order('next_due_on').limit(5)
    : { data: [] as { id: number; pet_id: string; title: string; next_due_on: string }[] }
  const petName = new Map((pets ?? []).map((p) => [p.id, p.name]))

  const first = profile.full_name.split(' ')[0]

  return (
    <>
      <PanelHeader title={first ? `Olá, ${first}` : 'Olá'} intro="Aqui você acompanha suas sessões, pedidos, reservas e a saúde dos seus pets. Volte quando precisar." />

      <section aria-labelledby="proximas">
        <h2 id="proximas" className="text-2xl">Próximas sessões</h2>
        <div className="mt-4">
          {next && next.length > 0 ? (
            <ul className="divide-y divide-areia rounded-2xl bg-white shadow-[0_1px_0_var(--color-areia)]">
              {next.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <span className="capitalize">{dateTime(a.starts_at)}</span>
                  <StatusBadge tone={a.status === 'confirmado' ? 'ok' : 'atencao'}>{APPOINTMENT_STATUS[a.status]}</StatusBadge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Nenhuma sessão marcada"
              action={<Link href="/psicologos" className="btn btn-primario">Encontrar um psicólogo</Link>}
            >
              Quando quiser conversar com alguém, escolha um profissional e um horário. Leva poucos minutos.
            </EmptyState>
          )}
          {next && next.length > 0 && <Link href="/painel/sessoes" className="link mt-4 inline-block">Ver todas as sessões</Link>}
        </div>
      </section>

      {((reminders && reminders.length > 0) || (openCare ?? 0) > 0) && (
        <section className="mt-12 grid gap-4 md:grid-cols-2" aria-label="Cuida e Saúde">
          {reminders && reminders.length > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)]">
              <h2 className="font-sans text-lg font-bold">Lembretes de saúde</h2>
              <ul className="mt-3 space-y-2">
                {reminders.map((r) => {
                  const due = dueLabel(r.next_due_on!)
                  return (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/painel/pets/${r.pet_id}`} className="hover:underline">{petName.get(r.pet_id)} · {r.title}</Link>
                      <StatusBadge tone={due.tone}>{due.text}</StatusBadge>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {(openCare ?? 0) > 0 && (
            <Link href="/painel/reservas" className="rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)] hover:shadow-[0_10px_30px_-20px_rgba(46,42,39,.5)]">
              <span className="block font-sans text-lg font-bold">Reservas com cuidadores</span>
              <span className="mt-1 block text-grafite-suave">{openCare} em andamento. Ver detalhes.</span>
            </Link>
          )}
        </section>
      )}

      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Atalhos">
        {(
          [
            ['/encontre-apoio', 'Ler sobre o luto', 'Textos para os dias difíceis.'],
            ['/loja', 'Guardar uma lembrança', 'Homenagens feitas sob encomenda.'],
            ['/ajuda-imediata', 'Ajuda imediata', 'CVV 188, a qualquer hora.'],
          ] as const
        ).map(([href, t, d]) => (
          <Link key={href} href={href} className="rounded-2xl border-[1.5px] border-areia-escura p-5 hover:bg-white">
            <span className="block font-serif text-xl">{t}</span>
            <span className="mt-1 block text-grafite-suave">{d}</span>
          </Link>
        ))}
      </section>
    </>
  )
}
