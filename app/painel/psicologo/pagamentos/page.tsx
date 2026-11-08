import { EmptyState, PanelHeader, Stat, StatusBadge } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { isSplitConfigured } from '@/lib/env'
import { ensurePsychologistRow, getPlatformFeePercent } from '@/lib/psychologist'
import { APPOINTMENT_STATUS, dateTime, money } from '@/lib/format'
import { connectMercadoPago, disconnectMercadoPago } from './actions'
import type { Appointment } from '@/types/db'

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string; desconectado?: string }>
}) {
  const session = await requireSession(['psicologo'], '/painel/psicologo/pagamentos')
  const { ok, erro, desconectado } = await searchParams
  const [psych, fee] = await Promise.all([ensurePsychologistRow(session), getPlatformFeePercent()])
  const splitReady = isSplitConfigured()
  const supabase = await createClient()

  const { data: paid } = await supabase
    .from('appointments')
    .select('*')
    .eq('psychologist_id', session.userId)
    .not('paid_at', 'is', null)
    .order('starts_at', { ascending: false })
    .limit(100)
    .returns<Appointment[]>()

  const valid = (paid ?? []).filter((a) => !a.refunded_at)
  const gross = valid.reduce((n, a) => n + a.price_cents, 0)
  const commission = valid.reduce((n, a) => n + a.platform_fee_cents, 0)
  const connected = psych?.mp_connected ?? false

  return (
    <>
      <PanelHeader
        title="Pagamentos"
        intro={`Os pacientes pagam por Pix ou cartão no Mercado Pago. No mesmo momento, ${100 - fee}% vai para a sua conta e ${fee}% fica com a PetApoio. Não há repasse manual nem espera.`}
      />

      {(ok || erro || desconectado) && (
        <p
          role={erro ? 'alert' : 'status'}
          className={`mb-6 rounded-lg px-4 py-3 ${erro ? 'bg-[#f6e7e3] text-alerta' : 'bg-salvia-clara text-salvia-noite'}`}
        >
          {erro ?? (ok ? 'Conta do Mercado Pago conectada. Você já pode receber agendamentos.' : 'Conta desconectada. Seu perfil deixa de receber novos agendamentos.')}
        </p>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl">Sua conta Mercado Pago</h2>
          <StatusBadge tone={connected ? 'ok' : 'atencao'}>{connected ? 'Conectada' : 'Não conectada'}</StatusBadge>
        </div>

        {!splitReady ? (
          <p className="mt-3 max-w-[62ch] text-grafite-suave">
            A PetApoio está finalizando a ativação dos pagamentos. Assim que estiver pronto, você poderá conectar sua conta
            aqui. Enquanto isso, complete seu perfil e seus horários.
          </p>
        ) : connected ? (
          <>
            <p className="mt-3 max-w-[62ch] text-grafite-suave">
              Os pagamentos das suas sessões caem diretamente nesta conta. Se desconectar, seu perfil para de aceitar novos
              agendamentos até você conectar de novo.
            </p>
            <details className="mt-5">
              <summary className="link cursor-pointer">Desconectar conta</summary>
              <form action={disconnectMercadoPago} className="mt-3">
                <button type="submit" className="btn btn-secundario">Confirmar desconexão</button>
              </form>
            </details>
          </>
        ) : (
          <>
            <ol className="mt-4 max-w-[62ch] list-decimal space-y-1 pl-5 text-grafite-suave">
              <li>Você vai para o site do Mercado Pago e entra na sua conta (ou cria uma, de graça).</li>
              <li>Autoriza a PetApoio a criar cobranças em seu nome, com a comissão de {fee}%.</li>
              <li>Volta para cá com a conta conectada.</li>
            </ol>
            <p className="mt-3 max-w-[62ch] text-[0.95rem] text-grafite-suave">
              A PetApoio não acessa seu saldo nem faz saques. A autorização serve apenas para criar as cobranças das sessões.
            </p>
            <form action={connectMercadoPago} className="mt-5">
              <button type="submit" className="btn btn-primario">Conectar minha conta Mercado Pago</button>
            </form>
          </>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Totais recebidos">
        <Stat label="Recebido (bruto)" value={money(gross)} hint="Sessões pagas, sem reembolsos" />
        <Stat label={`Comissão PetApoio (${fee}%)`} value={money(commission)} />
        <Stat label="Seu líquido" value={money(gross - commission)} hint="Antes das taxas do Mercado Pago" />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl">Extrato</h2>
        {paid && paid.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-[0.97rem]">
              <thead className="text-sm text-grafite-suave">
                <tr className="border-b border-areia">
                  <th className="py-2 font-normal">Sessão</th>
                  <th className="py-2 font-normal">Status</th>
                  <th className="py-2 text-right font-normal">Valor</th>
                  <th className="py-2 text-right font-normal">Comissão</th>
                  <th className="py-2 text-right font-normal">Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-areia">
                {paid.map((a) => (
                  <tr key={a.id} className={a.refunded_at ? 'text-grafite-suave line-through' : ''}>
                    <td className="py-3">{dateTime(a.starts_at)}</td>
                    <td className="py-3 no-underline">{a.refunded_at ? 'Reembolsada' : APPOINTMENT_STATUS[a.status]}</td>
                    <td className="py-3 text-right">{money(a.price_cents)}</td>
                    <td className="py-3 text-right">{money(a.platform_fee_cents)}</td>
                    <td className="py-3 text-right font-semibold">{money(a.price_cents - a.platform_fee_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Nenhum pagamento ainda">Os pagamentos das sessões aparecem aqui assim que forem aprovados.</EmptyState>
        )}
      </section>
    </>
  )
}
