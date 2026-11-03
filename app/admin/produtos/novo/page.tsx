import Link from 'next/link'
import { PanelHeader } from '@/components/panel-shell'
import { ProductForm } from '@/components/loja/product-form'
import { requireSession } from '@/lib/auth'

export default async function NovoProdutoPage() {
  await requireSession(['admin'], '/admin/produtos/novo')
  return (
    <>
      <PanelHeader title="Novo produto" intro={<Link href="/admin/produtos" className="link">Voltar para produtos</Link>} />
      <ProductForm />
    </>
  )
}
