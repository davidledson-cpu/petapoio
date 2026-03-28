'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
  Star,
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Shield,
  MessageCircle,
  RefreshCw,
  ChevronRight,
  Heart,
  Eye,
  Plus,
  Minus,
} from 'lucide-react'

/* ───────── TYPES ───────── */
interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  category: string
  badge?: string
  emoji: string
  benefits: string[]
  description: string
}

/* ───────── DATA ───────── */
const categories = [
  { key: 'todos', label: 'Todos', emoji: '🐾' },
  { key: 'alimentacao', label: 'Alimentação', emoji: '🍖' },
  { key: 'higiene', label: 'Higiene e Limpeza', emoji: '🧼' },
  { key: 'brinquedos', label: 'Brinquedos', emoji: '🧸' },
  { key: 'acessorios', label: 'Acessórios', emoji: '🦴' },
  { key: 'saude', label: 'Saúde e Bem-estar', emoji: '❤️' },
]

const collections = [
  { label: '🔥 Queridinhos dos Pets', key: 'mais-vendido' },
  { label: '💸 Ofertas da Semana', key: 'oferta' },
  { label: '🐾 Essenciais do Dia a Dia', key: 'essencial' },
]

const products: Product[] = [
  // ALIMENTAÇÃO
  { id: 1, name: 'Ração Premium Golden para Cães', price: 129.90, rating: 4.8, reviews: 1200, category: 'alimentacao', badge: 'Mais Vendido', emoji: '🐶', benefits: ['Pelagem mais brilhante', 'Melhor digestão', 'Alta palatabilidade', 'Rica em proteínas'], description: 'Nutrição completa para garantir energia, saúde e longevidade ao seu melhor amigo.' },
  { id: 2, name: 'Ração Whiskas para Gatos', price: 89.90, rating: 4.7, reviews: 890, category: 'alimentacao', emoji: '🐱', benefits: ['Sabor irresistível', 'Saúde urinária', 'Nutrientes essenciais'], description: 'Alimentação completa e balanceada para gatos adultos.' },
  { id: 3, name: 'Petisco Natural Desidratado', price: 39.90, rating: 4.9, reviews: 456, category: 'alimentacao', emoji: '🦴', benefits: ['100% natural', 'Sem conservantes', 'Ideal para treino'], description: 'Petiscos saudáveis feitos com ingredientes naturais selecionados.' },
  { id: 4, name: 'Comedouro Anti-Formiga', price: 34.90, rating: 4.6, reviews: 320, category: 'alimentacao', emoji: '🥣', benefits: ['Evita contaminação', 'Fácil limpeza', 'Design funcional'], description: 'Comedouro inteligente que protege a comida do seu pet.' },
  // HIGIENE
  { id: 5, name: 'Tapete Higiênico Super Absorvente', price: 79.90, rating: 4.8, reviews: 980, category: 'higiene', badge: 'Mais Vendido', emoji: '🧻', benefits: ['Alta absorção', 'Neutraliza odores', 'Ideal para apartamentos'], description: 'Tapetes higiênicos de alta performance para o dia a dia.' },
  { id: 6, name: 'Areia Sanitária Pipicat', price: 49.90, rating: 4.7, reviews: 750, category: 'higiene', badge: 'Mais Vendido', emoji: '🪣', benefits: ['Controle de odor', 'Forma torrões firmes', 'Econômica'], description: 'Areia sanitária premium para gatos exigentes.' },
  { id: 7, name: 'Shampoo Pet Neutro', price: 29.90, rating: 4.5, reviews: 410, category: 'higiene', emoji: '🧴', benefits: ['Não agride a pele', 'Perfume suave', 'Indicado para uso frequente'], description: 'Shampoo suave para banhos frequentes sem irritar a pele.' },
  { id: 8, name: 'Cortador de Unhas Pet', price: 24.90, rating: 4.4, reviews: 280, category: 'higiene', emoji: '✂️', benefits: ['Seguro e preciso', 'Fácil de usar', 'Evita acidentes'], description: 'Cortador ergonômico para cuidar das unhas do seu pet.' },
  // BRINQUEDOS
  { id: 9, name: 'Brinquedo Interativo Inteligente', price: 59.90, rating: 4.9, reviews: 670, category: 'brinquedos', badge: 'Mais Vendido', emoji: '🎯', benefits: ['Estimula a mente', 'Reduz ansiedade', 'Evita tédio'], description: 'Brinquedo que desafia e diverte seu pet por horas.' },
  { id: 10, name: 'Mordedor Ultra Resistente', price: 44.90, rating: 4.6, reviews: 520, category: 'brinquedos', emoji: '🦷', benefits: ['Alta durabilidade', 'Ajuda na dentição', 'Seguro para mastigação'], description: 'Mordedor feito para aguentar as mordidas mais fortes.' },
  { id: 11, name: 'Bola Interativa com Som', price: 29.90, rating: 4.5, reviews: 390, category: 'brinquedos', emoji: '⚽', benefits: ['Atrai atenção', 'Incentiva atividade', 'Ideal para filhotes'], description: 'Bola com som que estimula brincadeiras e exercícios.' },
  { id: 12, name: 'Arranhador para Gatos', price: 69.90, rating: 4.7, reviews: 440, category: 'brinquedos', emoji: '🐈', benefits: ['Protege móveis', 'Reduz estresse', 'Design compacto'], description: 'Arranhador vertical compacto ideal para espaços pequenos.' },
  // ACESSÓRIOS
  { id: 13, name: 'Coleira com Identificação', price: 19.90, rating: 4.3, reviews: 600, category: 'acessorios', emoji: '📛', benefits: ['Segurança extra', 'Ajustável', 'Confortável'], description: 'Coleira personalizada com plaquinha de identificação.' },
  { id: 14, name: 'Guia Retrátil', price: 59.90, rating: 4.6, reviews: 480, category: 'acessorios', emoji: '🔗', benefits: ['Mais liberdade', 'Controle seguro', 'Trava inteligente'], description: 'Guia retrátil de 5 metros com sistema de trava.' },
  { id: 15, name: 'Caminha Confortável Pet', price: 119.90, rating: 4.8, reviews: 350, category: 'acessorios', emoji: '🛏️', benefits: ['Super macia', 'Antiestresse', 'Lavável'], description: 'Caminha acolchoada para noites tranquilas.' },
  { id: 16, name: 'Caixa de Transporte', price: 149.90, rating: 4.7, reviews: 290, category: 'acessorios', emoji: '📦', benefits: ['Segurança em viagens', 'Ventilação ideal', 'Resistente'], description: 'Caixa de transporte aprovada para viagens aéreas.' },
  // SAÚDE
  { id: 17, name: 'Suplemento Vitamínico Pet', price: 49.90, rating: 4.5, reviews: 310, category: 'saude', emoji: '💊', benefits: ['Fortalece imunidade', 'Mais energia', 'Rico em vitaminas'], description: 'Suplemento completo para saúde e vitalidade.' },
  { id: 18, name: 'Repelente Antipulgas', price: 39.90, rating: 4.6, reviews: 580, category: 'saude', emoji: '🛡️', benefits: ['Proteção eficaz', 'Fácil aplicação', 'Seguro para pets'], description: 'Proteção contra pulgas e carrapatos por até 30 dias.' },
  { id: 19, name: 'Escova Removedora de Pelos', price: 54.90, rating: 4.8, reviews: 720, category: 'saude', badge: 'Mais Vendido', emoji: '🪮', benefits: ['Remove pelos mortos', 'Reduz queda', 'Fácil limpeza'], description: 'Escova profissional que remove pelos mortos sem machucar.' },
  { id: 20, name: 'Bebedouro Automático', price: 89.90, rating: 4.7, reviews: 460, category: 'saude', emoji: '💧', benefits: ['Água sempre fresca', 'Incentiva hidratação', 'Silencioso'], description: 'Bebedouro com filtro que mantém a água sempre limpa.' },
]

const testimonials = [
  { name: 'Mariana S.', text: 'Minha cachorra nunca foi tão feliz! Entrega rápida e produtos de qualidade.', rating: 5, pet: '🐕' },
  { name: 'João P.', text: 'Ração excelente, meu gato adorou. Preço justo e ótimo atendimento.', rating: 5, pet: '🐈' },
  { name: 'Fernanda L.', text: 'Os brinquedos são super resistentes. Recomendo demais!', rating: 5, pet: '🐕' },
]

const upsells = [
  { combo: 'Ração + Comedouro', discount: '10% OFF', emoji: '🍖+🥣' },
  { combo: 'Caminha + Brinquedo', discount: 'Combo conforto', emoji: '🛏️+🧸' },
  { combo: 'Leve 3, Pague 2', discount: 'Petiscos', emoji: '🦴×3' },
]

/* ───────── HELPERS ───────── */
function formatPrice(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}
function renderStars(n: number) {
  return '⭐'.repeat(Math.round(n))
}

/* ───────── COMPONENT ───────── */
export default function LojaPage() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const bestSellers = products.filter((p) => p.badge === 'Mais Vendido')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-petbeige-50">
        {/* ═══ HERO BANNER ═══ */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="container text-center text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest mb-4">
              Loja PetApoio
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Cuidando de quem te ama<br />sem limites 🐶🐱
            </h1>
            <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8">
              Tudo para o bem-estar do seu pet, com qualidade e preço justo.
            </p>
            <div className="flex items-center max-w-lg mx-auto bg-white rounded-full shadow-lg overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3.5 text-gray-800 text-sm focus:outline-none"
              />
              <button className="px-6 py-3.5 bg-petblue-500 text-white text-sm font-bold hover:bg-petblue-600 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* ═══ BENEFITS BAR ═══ */}
        <section className="bg-white border-b border-gray-100 shadow-sm">
          <div className="container py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Truck, text: 'Frete grátis acima de R$99', color: 'text-petblue-500' },
                { icon: Shield, text: 'Compra segura', color: 'text-green-500' },
                { icon: MessageCircle, text: 'Atendimento via WhatsApp', color: 'text-petblue-500' },
                { icon: RefreshCw, text: 'Garantia de 7 dias', color: 'text-amber-500' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-3">
                  <b.icon className={`w-5 h-5 ${b.color} flex-shrink-0`} />
                  <span className="text-xs md:text-sm font-medium text-gray-700">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ COLLECTIONS ═══ */}
        <section className="py-8">
          <div className="container">
            <div className="flex flex-wrap gap-3 justify-center">
              {collections.map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    if (c.key === 'mais-vendido') {
                      setActiveCategory('todos')
                      setSearchQuery('')
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-petblue-400 hover:text-petblue-600 shadow-sm transition-all"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BEST SELLERS ═══ */}
        <section className="pb-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
                🔥 Mais Vendidos
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bestSellers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl p-4 text-left transition-all duration-200 group"
                >
                  <div className="text-4xl text-center mb-3">{p.emoji}</div>
                  <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2 mb-1 group-hover:text-petblue-600 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-[10px] text-yellow-500 mb-1">{renderStars(p.rating)} <span className="text-gray-400">({p.reviews})</span></div>
                  <div className="font-bold text-petblue-600 text-sm">{formatPrice(p.price)}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CATEGORIES + PRODUCTS ═══ */}
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              🐾 Todos os Produtos
            </h2>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat.key
                      ? 'bg-petblue-500 text-white shadow-md'
                      : 'bg-petbeige-50 text-gray-600 border border-gray-200 hover:border-petblue-300 hover:text-petblue-600'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 group"
                >
                  {/* Badge */}
                  {p.badge && (
                    <div className="bg-red-500 text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
                      {p.badge}
                    </div>
                  )}
                  {/* Product Image Placeholder */}
                  <div className="bg-petbeige-50 p-6 text-center">
                    <div className="text-5xl mb-2">{p.emoji}</div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2 group-hover:text-petblue-600 transition-colors line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                      <span className="text-xs text-gray-400">({p.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-petblue-700 text-lg">{formatPrice(p.price)}</div>
                      <button
                        onClick={() => {
                          setCartCount((c) => c + 1)
                          setSelectedProduct(p)
                        }}
                        className="p-2 rounded-full bg-petblue-500 text-white hover:bg-petblue-600 transition-colors shadow-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-500">Nenhum produto encontrado. Tente outra busca.</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══ UPSELL / COMPRE JUNTO ═══ */}
        <section className="py-12 bg-petbeige-50">
          <div className="container">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              🚀 Compre Junto e Economize
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {upsells.map((u) => (
                <div
                  key={u.combo}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className="text-3xl mb-3">{u.emoji}</div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{u.combo}</h3>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-bold">
                    {u.discount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROMOTIONAL CAMPAIGNS ═══ */}
        <section className="py-12 gradient-hero">
          <div className="container text-center text-white">
            <h2 className="font-serif text-3xl font-bold mb-6">📣 Promoções Ativas</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Semana do Pet Feliz', desc: 'Até 20% OFF em produtos selecionados', badge: '🎉' },
                { title: 'Leve 3, Pague 2', desc: 'Em todos os petiscos da loja', badge: '🦴' },
                { title: 'Frete Grátis Progressivo', desc: 'Quanto mais comprar, menos frete paga', badge: '🚚' },
              ].map((promo) => (
                <div
                  key={promo.title}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl mb-3">{promo.badge}</div>
                  <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                  <p className="text-white/80 text-sm">{promo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              ⭐ O que nossos clientes dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-petbeige-50 rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="text-yellow-400 text-sm mb-3">{renderStars(t.rating)}</div>
                  <p className="text-gray-700 text-sm italic mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.pet}</span>
                    <span className="font-bold text-gray-800 text-sm">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ WHATSAPP CTA ═══ */}
        <section className="py-12 bg-petgreen-50">
          <div className="container text-center">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">
              Precisa de ajuda?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nosso time está pronto para ajudar você a escolher o melhor produto para seu pet.
            </p>
            <a
              href="https://wa.me/5511999999999?text=Oi!%20Preciso%20de%20ajuda%20para%20escolher%20o%20melhor%20produto%20pro%20meu%20pet!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>
        </section>

        {/* ═══ PRODUCT MODAL ═══ */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Product Header */}
              <div className="bg-petbeige-50 p-8 text-center relative">
                {selectedProduct.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                    {selectedProduct.badge}
                  </span>
                )}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                >
                  ✕
                </button>
                <div className="text-7xl mb-4">{selectedProduct.emoji}</div>
              </div>
              {/* Product Details */}
              <div className="p-6">
                <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold">{selectedProduct.rating}</span>
                  <span className="text-sm text-gray-400">({selectedProduct.reviews} avaliações)</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-800 mb-2">Benefícios:</h4>
                  <div className="space-y-1.5">
                    {selectedProduct.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span> {b}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="font-bold text-petblue-700 text-2xl">
                    {formatPrice(selectedProduct.price)}
                  </div>
                  <button
                    onClick={() => {
                      setCartCount((c) => c + 1)
                      setSelectedProduct(null)
                    }}
                    className="px-6 py-3 rounded-full bg-petblue-500 text-white font-bold text-sm hover:bg-petblue-600 transition-colors shadow-md flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Garanta já!
                  </button>
                </div>
                {/* Guarantee */}
                <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100 text-center">
                  <p className="text-xs text-green-700 font-medium">
                    🔒 Compra segura • 🚚 Frete grátis acima de R$99 • 🔄 Garantia de 7 dias
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FLOATING CART ═══ */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <button className="relative p-4 rounded-full bg-petblue-500 text-white shadow-xl hover:bg-petblue-600 transition-all hover:scale-110">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
