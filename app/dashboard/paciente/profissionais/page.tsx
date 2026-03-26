import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/layout'
import { ProfissionaisClient } from './client'

export default async function ProfissionaisPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  return (
    <DashboardLayout userRole="patient" userName={user.name || 'Tutor'} userAvatar={user.avatar}>
      <ProfissionaisClient
        patientName={user.name || 'Tutor(a) PetApoio'}
        patientEmail={user.email || 'paciente@petapoio.com.br'}
      />
    </DashboardLayout>
  )
}
