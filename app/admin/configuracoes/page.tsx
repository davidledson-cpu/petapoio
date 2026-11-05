import { PanelHeader, StatusBadge } from '@/components/panel-shell'
import { SettingsForm } from '@/components/settings-form'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { isMercadoPagoConfigured, isSplitConfigured } from '@/lib/env'
import type { PlatformSettings } from '@/types/db'

export default async function ConfiguracoesPage() {
  await requireSession(['admin'], '/admin/configuracoes')
  const supabase = await createClient()
  const { data } = await supabase.from('platform_settings').select('*').single<PlatformSettings>()

  const integracoes = [
    ['Banco de dados e login (Supabase)', true],
    ['Chave de servidor (SUPABASE_SERVICE_ROLE_KEY)', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)],
    ['Pagamentos da loja (MP_ACCESS_TOKEN)', isMercadoPagoConfigured()],
    ['Split das sessões (MP_CLIENT_ID, MP_CLIENT_SECRET, PAYMENTS_ENCRYPTION_KEY)', isSplitConfigured()],
    ['Assinatura dos avisos de pagamento (MP_WEBHOOK_SECRET)', Boolean(process.env.MP_WEBHOOK_SECRET)],
  ] as const

  return (
    <>
      <PanelHeader title="Configurações" />
      {data && <SettingsForm s={data} />}
      <section className="mt-14 max-w-2xl border-t border-areia pt-8" aria-labelledby="integracoes">
        <h2 id="integracoes" className="text-2xl">Integrações</h2>
        <p className="mt-2 text-grafite-suave">As chaves ficam nas variáveis de ambiente da Vercel. Veja o passo a passo no README do projeto.</p>
        <ul className="mt-5 divide-y divide-areia border-y border-areia">
          {integracoes.map(([label, ok]) => (
            <li key={label} className="flex flex-wrap items-center justify-between gap-3 py-3">
              {label}
              <StatusBadge tone={ok ? 'ok' : 'atencao'}>{ok ? 'Configurado' : 'Pendente'}</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
