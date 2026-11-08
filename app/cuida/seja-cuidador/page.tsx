import { permanentRedirect } from 'next/navigation'

// O cadastro de cuidadores agora vive em Para profissionais.
export default function SejaCuidadorPage() {
  permanentRedirect('/seja-parceiro/cuidadores')
}
