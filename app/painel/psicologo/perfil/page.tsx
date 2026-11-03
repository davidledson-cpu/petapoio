import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { ProfileForm } from '@/components/psych/profile-form'
import { FileUpload } from '@/components/psych/file-upload'
import { requireSession } from '@/lib/auth'
import { ensurePsychologistRow } from '@/lib/psychologist'
import { publicFileUrl } from '@/lib/supabase/storage'
import { dateOnly, PSYCH_STATUS } from '@/lib/format'

export default async function PerfilPsicologoPage() {
  const session = await requireSession(['psicologo'], '/painel/psicologo/perfil')
  const psych = await ensurePsychologistRow(session)
  if (!psych) {
    return <EmptyState title="Não conseguimos abrir seu perfil">Recarregue a página ou escreva para contato@petapoio.com.br.</EmptyState>
  }

  const docDate = psych.document_path?.match(/documento-(\d+)/)?.[1]

  return (
    <>
      <PanelHeader
        title="Perfil público"
        intro="É o que as pessoas veem antes de escolher com quem conversar. Escreva como você falaria com alguém que acabou de perder um animal."
        action={
          psych.status === 'aprovado' && psych.slug ? (
            <Link href={`/psicologos/${psych.slug}`} className="btn btn-secundario">Ver como os pacientes veem</Link>
          ) : (
            <StatusBadge tone={psych.status === 'pendente' ? 'atencao' : 'erro'}>{PSYCH_STATUS[psych.status]}</StatusBadge>
          )
        }
      />

      <div className="grid gap-8">
        <section id="foto" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
          <h2 className="mb-5 text-2xl">Foto profissional</h2>
          <FileUpload kind="foto" userId={session.userId} previewUrl={publicFileUrl('avatars', psych.photo_path)} />
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
          <dl className="mb-6 grid gap-4 border-b border-areia pb-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-grafite-suave">CRP</dt>
              <dd className="font-semibold">{psych.crp}/{psych.crp_state}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-grafite-suave">Alterar o CRP</dt>
              <dd className="text-[0.97rem]">Escreva para contato@petapoio.com.br — o registro passa por nova verificação.</dd>
            </div>
          </dl>
          <ProfileForm psych={psych} fullName={session.profile.full_name} />
        </section>

        <section id="documento" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
          <h2 className="text-2xl">Documento de verificação</h2>
          <p className="mb-5 mt-2 text-grafite-suave">
            Usamos o documento só para confirmar sua identidade e seu registro. Ele não aparece no perfil público.
          </p>
          <FileUpload
            kind="documento"
            userId={session.userId}
            currentLabel={docDate ? `enviado em ${dateOnly(new Date(Number(docDate)))}` : psych.document_path ? 'enviado' : null}
          />
        </section>
      </div>
    </>
  )
}
