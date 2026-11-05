import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PanelHeader } from '@/components/panel-shell'
import { ProductForm } from '@/components/loja/product-form'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types/db'

export default async function EditarProdutoPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ salvo?: string }> }) {
  const { id } = await params
  const { salvo } = await searchParams
  await requireSession(['admin'], `/admin/produtos/${id}`)
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound()
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  const product = data as Product
  return (
    <>
      <PanelHeader
        title={product.name}
        intro={
          <span className="flex flex-wrap gap-4">
            <Link href="/admin/produtos" className="link">Voltar para produtos</Link>
            {product.active && <Link href={`/loja/${product.slug}`} className="link">Ver na loja</Link>}
          </span>
        }
      />
      {salvo && <p role="status" className="mb-6 rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite">Produto criado.</p>}
      <ProductForm product={product} />
    </>
  )
}
