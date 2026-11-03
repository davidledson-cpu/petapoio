import Link from 'next/link'
import { PanelHeader } from '@/components/panel-shell'
import { MyProfileForm } from '@/components/my-profile-form'
import { requireSession } from '@/lib/auth'

export default async function PerfilPage() {
  const { profile, email } = await requireSession(undefined, '/painel/perfil')
  return (
    <>
      <PanelHeader title="Meus dados" intro={<>E-mail de acesso: <strong className="text-grafite">{email}</strong></>} />
      <MyProfileForm fullName={profile.full_name} phone={profile.phone} />
      <section className="mt-12 max-w-lg border-t border-areia pt-8">
        <h2 className="text-2xl">Senha e privacidade</h2>
        <p className="mt-2 text-grafite-suave">
          Para trocar a senha, use <Link href="/recuperar-senha" className="link">Esqueci minha senha</Link>. Para baixar ou apagar seus dados,
          escreva para <a href="mailto:contato@petapoio.com.br" className="link">contato@petapoio.com.br</a>; respondemos em até 15 dias.
        </p>
      </section>
    </>
  )
}
