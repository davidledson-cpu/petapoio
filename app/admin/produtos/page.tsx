import Link from 'next/link'
import { EmptyState, PanelHeader, StatusBadge } from '@/components/panel-shell'
import { toggleProduct } from './actions'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, productImage } from '@/lib/loja/catalog'
import { money } from '@/lib/format'
import type { Product } from '@/types/db'

export default async function AdminProdutosPage() {
  await requireSession(['admin'], '/admin/produtos')
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').order('sort_order').order('name')
  const products = (data ?? []) as Product[]

  return (
    <>
      <PanelHeader
        title="Produtos"
        intro="Cadastre produtos, envie fotos e escolha o que aparece na loja."
        action={<Link href="/admin/produtos/novo" className="btn btn-primario">Novo produto</Link>}
      />
      {products.length === 0 ? (
        <EmptyState title="Nenhum produto cadastrado" action={<Link href="/admin/produtos/novo" className="btn btn-primario">Cadastrar o primeiro</Link>} />
      ) : (
        <ul className="divide-y divide-areia border-y border-areia">
          {products.map((p) => {
            const img = productImage(p.images[0])
            return (
              <li key={p.id} className="grid grid-cols-[4rem_1fr] items-center gap-4 py-4 sm:grid-cols-[4rem_1fr_auto]">
                <div className="size-16 overflow-hidden rounded-lg bg-areia">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <Link href={`/admin/produtos/${p.id}`} className="font-serif text-xl hover:text-salvia-funda">{p.name}</Link>
                  <p className="text-[0.95rem] text-grafite-suave">
                    {CATEGORIES[p.category].label} · {money(p.price_cents)} · {p.images.length} {p.images.length === 1 ? 'foto' : 'fotos'}
                  </p>
                </div>
                <div className="col-start-2 flex items-center gap-3 sm:col-start-3">
                  <StatusBadge tone={p.active ? 'ok' : 'neutro'}>{p.active ? 'Na loja' : 'Oculto'}</StatusBadge>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="active" value={String(p.active)} />
                    <button type="submit" className="text-[0.95rem] link">{p.active ? 'Ocultar' : 'Mostrar'}</button>
                  </form>
                  <Link href={`/admin/produtos/${p.id}`} className="text-[0.95rem] link">Editar</Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
