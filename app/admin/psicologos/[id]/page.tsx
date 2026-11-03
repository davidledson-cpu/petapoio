import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PanelHeader, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { publicFileUrl } from '@/lib/supabase/storage'
import { dateOnly, money, PSYCH_STATUS } from '@/lib/format'
import { MODALITY_LABEL, WEEKDAY_SHORT } from '@/lib/psychologist'
import { reviewPsychologist } from '../actions'
import type { Availability, Psychologist } from '@/types/db'

type Row = Psychologist & { profile: { full_name: string; phone: string | null } | null }

const TONE = { pendente: 'atencao', aprovado: 'ok', recusado: 'erro', suspenso: 'erro' } as const

export default async function AdminPsicologoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ok?: string; erro?: string }>
}) {
  await requireSession(['admin'], '/admin/psicologos')
  const [{ id }, { ok, erro }] = await Promise.all([params, searchParams])
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound()

  const supabase = await createClient()
  const { data: p } = await supabase
    .from('psychologists')
    .select('*, profile:profiles!psychologists_id_fkey(full_name, phone)')
    .eq('id', id)
    .maybeSingle<Row>()
  if (!p) notFound()

  const { data: slots } = await supabase.from('availability').select('*').eq('psychologist_id', id).order('weekday').returns<Availability[]>()

  let documentUrl: string | null = null
  let email: string | null = null
  try {
    const admin = createAdminClient()
    if (p.document_path) {
      const { data } = await admin.storage.from('documents').createSignedUrl(p.document_path, 60)
      documentUrl = data?.signedUrl ?? null
    }
    const { data: u } = await admin.auth.admin.getUserById(id)
    email = u.user?.email ?? null
  } catch {
    // Sem service_role neste ambiente: o documento não pode ser aberto.
  }

  const photo = publicFileUrl('avatars', p.photo_path)
  const rows: [string, React.ReactNode][] = [
    ['E-mail', email ?? '—'],
    ['Telefone', p.profile?.phone ?? '—'],
    ['CRP', `${p.crp}/${p.crp_state}`],
    ['Modalidade', MODALITY_LABEL[p.modality] + (p.city ? ` · ${p.city}/${p.state ?? ''}` : '')],
    ['Abordagem', p.approach ?? '—'],
    ['Temas', p.specialties.join(', ') || '—'],
    ['Luto pet', p.pet_grief_experience ? 'Tem experiência' : 'Não informou'],
    ['Público', [p.serves_children && 'Crianças', p.serves_families && 'Famílias'].filter(Boolean).join(', ') || 'Adultos'],
    ['Valor', `${money(p.session_price_cents)} · ${p.session_minutes} min`],
    ['Videochamada', p.meeting_url ? <a key="m" href={p.meeting_url} className="link break-all" target="_blank" rel="noopener noreferrer">{p.meeting_url}</a> : 'Não cadastrado'],
    ['Mercado Pago', p.mp_connected ? 'Conectado' : 'Não conectado'],
    ['Horários', slots?.length ? slots.map((s) => `${WEEKDAY_SHORT[s.weekday]} ${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`).join(' · ') : 'Nenhum'],
    ['Cadastro', dateOnly(p.created_at)],
    ['Termos aceitos', p.accepted_terms_at ? dateOnly(p.accepted_terms_at) : '—'],
  ]

  return (
    <>
      <Link href="/admin/psicologos" className="link text-[0.95rem]">Todos os psicólogos</Link>
      <PanelHeader
        title={p.profile?.full_name || 'Sem nome'}
        intro={p.headline ?? undefined}
        action={<StatusBadge tone={TONE[p.status]}>{PSYCH_STATUS[p.status]}</StatusBadge>}
      />
      {ok && <p role="status" className="mb-6 rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">Decisão salva e psicólogo notificado.</p>}
      {erro && <p role="alert" className="mb-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{erro}</p>}

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
          <div className="flex items-center gap-5">
            <div className="size-24 shrink-0 overflow-hidden rounded-full bg-areia">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-sm text-grafite-suave">Sem foto</span>
              )}
            </div>
            {p.slug && p.status === 'aprovado' && (
              <Link href={`/psicologos/${p.slug}`} className="link">Ver perfil público</Link>
            )}
          </div>
          <dl className="mt-6 divide-y divide-areia border-y border-areia">
            {rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-2.5 sm:grid-cols-[10rem_1fr]">
                <dt className="text-grafite-suave">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {p.bio && (
            <div className="mt-6">
              <h2 className="text-xl">Bio</h2>
              <p className="mt-2 whitespace-pre-line text-grafite-suave">{p.bio}</p>
            </div>
          )}
          {p.education && (
            <div className="mt-6">
              <h2 className="text-xl">Formação</h2>
              <p className="mt-2 whitespace-pre-line text-grafite-suave">{p.education}</p>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-linho-escuro p-6">
            <h2 className="text-xl">Verificação</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.97rem]">
              <li>
                Abra o documento enviado:{' '}
                {documentUrl ? (
                  <a href={documentUrl} className="link" target="_blank" rel="noopener noreferrer">ver documento</a>
                ) : p.document_path ? (
                  <span className="text-grafite-suave">indisponível (configure SUPABASE_SERVICE_ROLE_KEY)</span>
                ) : (
                  <span className="text-alerta">ainda não enviado</span>
                )}
                {documentUrl && <span className="text-sm text-grafite-suave"> (link válido por 60 segundos; recarregue a página para gerar outro)</span>}
              </li>
              <li>
                Confira nome, CRP {p.crp} e situação “ativo” no{' '}
                <a href="https://cadastro.cfp.org.br/" className="link" target="_blank" rel="noopener noreferrer">Cadastro Nacional de Psicólogos</a>.
              </li>
              <li>Revise a bio: sem promessas de resultado, depoimentos ou dados de pacientes.</li>
            </ol>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]">
            <h2 className="text-xl">Decisão</h2>
            <form action={reviewPsychologist} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={p.id} />
              <div>
                <label htmlFor="note" className="rotulo">Observação para o psicólogo</label>
                <textarea id="note" name="note" rows={4} maxLength={1000} defaultValue={p.review_note ?? ''} className="campo" />
                <p className="dica">Obrigatória para recusar ou suspender. O psicólogo vê no painel.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.status !== 'aprovado' && (
                  <button type="submit" name="decision" value="aprovado" className="btn btn-primario">Aprovar perfil</button>
                )}
                {p.status === 'pendente' && (
                  <button type="submit" name="decision" value="recusado" className="btn btn-secundario">Recusar</button>
                )}
                {p.status === 'aprovado' && (
                  <button type="submit" name="decision" value="suspenso" className="btn btn-secundario">Suspender</button>
                )}
                {(p.status === 'recusado' || p.status === 'suspenso') && (
                  <button type="submit" name="decision" value="pendente" className="btn btn-secundario">Voltar para análise</button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}
