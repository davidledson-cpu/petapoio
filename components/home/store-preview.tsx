import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const products = [
  { name: 'Plaquinha Memorial Personalizada', price: 89, emoji: '🏷️', category: 'Memorial' },
  { name: 'Retrato Digital do Seu Pet', price: 159, emoji: '🎨', category: 'Arte' },
  { name: 'Cápsula de Sementes — "Renascer"', price: 49, emoji: '🌱', category: 'Natureza' },
  { name: 'Kit Autocuidado no Luto', price: 129, emoji: '💙', category: 'Bem-estar' },
]

export function StorePreview() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-petbeige-100 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
              Loja Memorial
            </span>
            <h2 className="font-serif text-4xl font-bold text-gray-800">
              Homenageie com carinho
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg">
              Produtos para honrar a memória do seu pet e cuidar de você neste momento.
            </p>
          </div>
          <Link
            href="/loja"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-petblue-500 hover:gap-3 transition-all"
          >
            Ver toda a loja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map(product => (
            <div key={product.name} className="group bg-petbeige-50 rounded-2xl p-6 card-hover cursor-pointer">
              <div className="text-4xl mb-4 text-center">{product.emoji}</div>
              <div className="text-xs font-bold text-petblue-400 uppercase tracking-wide mb-1">{product.category}</div>
              <h4 className="font-bold text-sm text-gray-800 leading-tight mb-3">{product.name}</h4>
              <div className="flex items-center justify-between">
                <span className="font-bold text-petblue-600">{formatCurrency(product.price)}</span>
                <button className="w-8 h-8 rounded-full bg-petblue-400 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-petblue-500">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
