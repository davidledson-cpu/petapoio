import { JsonLd } from './json-ld'

/** Perguntas frequentes em <details>, com dados estruturados FAQPage. */
export function Faq({ items, structuredData = true }: { items: { q: string; a: string }[]; structuredData?: boolean }) {
  return (
    <>
      <div className="divide-y divide-areia border-y border-areia">
        {items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-xl">
              {item.q}
              <span aria-hidden="true" className="mt-1 text-salvia-funda transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-[62ch] text-grafite-suave">{item.a}</p>
          </details>
        ))}
      </div>
      {structuredData && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }}
        />
      )}
    </>
  )
}
