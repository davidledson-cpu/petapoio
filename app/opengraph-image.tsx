import { ImageResponse } from 'next/og'

export const alt = 'PetApoio — cuidado, apoio e acolhimento para você e seu pet'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#f6f5f0',
          color: '#2e2a27',
        }}
      >
        <div style={{ fontSize: 40, color: '#3e5a4b' }}>PetApoio</div>
        <div style={{ fontSize: 68, lineHeight: 1.1, maxWidth: 980 }}>
          Ao seu lado em cada fase da vida do seu pet.
        </div>
        <div style={{ fontSize: 30, color: '#5a534d' }}>Apoio no luto · Cuidadores e adestradores · Saúde</div>
      </div>
    ),
    size,
  )
}
