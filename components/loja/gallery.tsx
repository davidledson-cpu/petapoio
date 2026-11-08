'use client'

import { useState } from 'react'

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0)
  if (images.length === 0) return <div className="aspect-square rounded-[1.5rem] bg-areia" />
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-areia">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[current]} alt={`${name}, imagem ${current + 1} de ${images.length}`} width={1200} height={1200} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-pressed={i === current}
                className={`block size-20 overflow-hidden rounded-xl ring-offset-2 ring-offset-linho ${i === current ? 'ring-2 ring-salvia-funda' : 'opacity-75 hover:opacity-100'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" width={160} height={160} className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
