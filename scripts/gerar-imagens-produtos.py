"""Gera as imagens ilustrativas dos produtos da loja (SVG -> PNG via Chrome -> WebP).
Uso: python3 scripts/gerar-imagens-produtos.py
São ilustrações de referência até existirem fotos reais; substitua pelo painel admin."""
import pathlib, sys
from playwright.sync_api import sync_playwright
from PIL import Image

OUT = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'produtos'
OUT.mkdir(parents=True, exist_ok=True)

LINHO, AREIA, AREIA2, SALVIA, SALVIA_CL, SALVIA_F, NEVOA, NEVOA_CL, GRAF = (
    '#f6f5f0', '#e7dfd1', '#d6cab5', '#7c9a86', '#dfe7e0', '#3e5a4b', '#5d7381', '#e3e9ec', '#2e2a27')
MADEIRA, MADEIRA2, MADEIRA3 = '#c49a6c', '#a77d52', '#8a6440'

DEFS = f'''
<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faf9f5"/><stop offset="1" stop-color="{LINHO}"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{AREIA}"/><stop offset="1" stop-color="#ddd3c2"/></linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{MADEIRA}"/><stop offset="1" stop-color="{MADEIRA2}"/></linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f4f2"/><stop offset=".5" stop-color="#c9ccce"/><stop offset="1" stop-color="#9ea3a6"/></linearGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{NEVOA_CL}"/><stop offset="1" stop-color="{SALVIA_CL}"/></linearGradient>
  <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <pattern id="linen" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="{SALVIA}"/><path d="M0 4h8M4 0v8" stroke="#728f7b" stroke-width=".8" opacity=".5"/></pattern>
  <pattern id="grain" width="40" height="12" patternUnits="userSpaceOnUse"><path d="M0 6c10-3 20 3 40 0" stroke="{MADEIRA3}" stroke-width="1" fill="none" opacity=".35"/></pattern>
</defs>'''

def scene(body, horizon=760, floor=True):
    f = f'<rect y="{horizon}" width="1200" height="{1200-horizon}" fill="url(#floor)"/><rect y="{horizon}" width="1200" height="3" fill="#d9cfbd"/>' if floor else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">{DEFS}<rect width="1200" height="1200" fill="url(#wall)"/>{f}{body}</svg>'

def shadow(cx, cy, rx, ry, op=.28):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{GRAF}" opacity="{op}" filter="url(#blur)"/>'

def sprig(x, y, s=1, rot=0, color=SALVIA):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})"><path d="M0 0C10-80 30-160 70-240" stroke="{SALVIA_F}" stroke-width="5" fill="none" stroke-linecap="round"/>'
            + ''.join(f'<ellipse cx="{12+i*14}" cy="{-40-i*48}" rx="16" ry="34" fill="{color}" transform="rotate({-50 if i%2 else 30} {12+i*14} {-40-i*48})" opacity="{.8 if i%2 else .95}"/>' for i in range(4))
            + '</g>')

# Retratos ilustrados genéricos (sem personagens), formas simples
def dog(cx, cy, s=1, fur=MADEIRA, dark=MADEIRA3):
    return f'''<g transform="translate({cx} {cy}) scale({s})">
      <path d="M-120 210C-130 120-110 70-60 50L60 50C110 70 130 120 120 210Z" fill="{fur}"/>
      <ellipse cx="0" cy="-10" rx="105" ry="115" fill="{fur}"/>
      <path d="M-95-70C-150-60-170 40-140 90-120 115-95 80-90 40Z" fill="{dark}"/>
      <path d="M95-70C150-60 170 40 140 90 120 115 95 80 90 40Z" fill="{dark}"/>
      <ellipse cx="0" cy="45" rx="62" ry="50" fill="#efe3cf"/>
      <ellipse cx="0" cy="18" rx="22" ry="15" fill="{GRAF}"/>
      <path d="M0 33v20M-22 58c12 10 32 10 44 0" stroke="{GRAF}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="-40" cy="-25" r="10" fill="{GRAF}"/><circle cx="40" cy="-25" r="10" fill="{GRAF}"/>
      <circle cx="-37" cy="-28" r="3" fill="#fff"/><circle cx="43" cy="-28" r="3" fill="#fff"/>
    </g>'''

def cat(cx, cy, s=1, fur=NEVOA, light='#cdd6dc'):
    return f'''<g transform="translate({cx} {cy}) scale({s})">
      <path d="M-115 220C-125 130-105 80-60 60L60 60C105 80 125 130 115 220Z" fill="{fur}"/>
      <path d="M-92-40-80-150-20-85Z" fill="{fur}"/><path d="M92-40 80-150 20-85Z" fill="{fur}"/>
      <path d="M-82-60-76-125-40-88Z" fill="#e7c9c0"/><path d="M82-60 76-125 40-88Z" fill="#e7c9c0"/>
      <ellipse cx="0" cy="0" rx="105" ry="95" fill="{fur}"/>
      <ellipse cx="0" cy="40" rx="55" ry="40" fill="{light}"/>
      <path d="M-10 22h20l-10 12Z" fill="#c98e86"/>
      <path d="M0 34v10M-18 50c8 6 28 6 36 0" stroke="{GRAF}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-55-12c8-10 22-10 30 0M25-12c8-10 22-10 30 0" stroke="{GRAF}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M-40 40h-70M-40 52l-65 14M40 40h70M40 52l65 14" stroke="#f3f1ec" stroke-width="2.5" opacity=".8"/>
    </g>'''

def frame(x, y, w, h, inner, mat=LINHO, border=MADEIRA, bw=34, matw=46, clip='c'):
    return f'''<g>
      <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{border}"/>
      <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#grain)"/>
      <rect x="{x+bw}" y="{y+bw}" width="{w-2*bw}" height="{h-2*bw}" fill="{mat}"/>
      <rect x="{x+bw}" y="{y+bw}" width="{w-2*bw}" height="6" fill="{GRAF}" opacity=".12"/>
      <clipPath id="{clip}"><rect x="{x+bw+matw}" y="{y+bw+matw}" width="{w-2*(bw+matw)}" height="{h-2*(bw+matw)}"/></clipPath>
      <g clip-path="url(#{clip})">{inner}</g>
    </g>'''

def text(x, y, t, size=40, color=GRAF, family='Georgia, serif', weight=400, anchor='middle', extra=''):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}" {extra}>{t}</text>'

S = {}

# 1. Retrato ilustrado (parede + mesa)
S['retrato-ilustrado-1'] = scene(
    shadow(600, 770, 330, 26, .25)
    + frame(330, 170, 540, 640, f'<rect x="410" y="250" width="380" height="480" fill="{SALVIA_CL}"/><circle cx="600" cy="430" r="150" fill="{AREIA}"/>' + dog(600, 470, .95), border=MADEIRA, clip='c1')
    + sprig(960, 1000, 1.2, 8) + sprig(1010, 1010, .9, 22, NEVOA)
    + f'<rect x="880" y="900" width="150" height="130" rx="10" fill="{LINHO}" stroke="{AREIA2}" stroke-width="3"/>' + shadow(955, 1040, 90, 14, .22))
S['retrato-ilustrado-2'] = scene(
    frame(200, 160, 800, 880, f'<rect x="280" y="240" width="640" height="720" fill="{NEVOA_CL}"/><circle cx="600" cy="560" r="230" fill="{SALVIA_CL}"/>' + cat(600, 600, 1.5), border='#e9e3d7', bw=28, matw=52, clip='c2'),
    horizon=1100)

# 2. Quadro com foto e nome
S['quadro-foto-nome-1'] = scene(
    shadow(600, 800, 300, 24)
    + f'<rect x="360" y="190" width="480" height="620" fill="{GRAF}"/><rect x="382" y="212" width="436" height="576" fill="{LINHO}"/>'
    + '<clipPath id="c3"><rect x="440" y="270" width="320" height="330"/></clipPath>'
    + f'<g clip-path="url(#c3)"><rect x="440" y="270" width="320" height="330" fill="url(#sky)"/><path d="M440 540c80-40 160-40 320 0v60H440Z" fill="{SALVIA}"/>' + dog(600, 500, .62, fur='#d8b98f', dark='#9c7650') + '</g>'
    + text(600, 680, 'Mel', 50, GRAF) + text(600, 724, '2011 — 2025', 22, '#6d655d', 'Helvetica, Arial, sans-serif', extra='letter-spacing="3"')
    + sprig(250, 1020, 1, -12))

# 3. Caderno de memórias
nb = f'''<g transform="rotate(-7 600 700)">
  {shadow(620, 900, 330, 40, .3)}
  <rect x="330" y="420" width="560" height="460" rx="14" fill="{SALVIA_F}"/>
  <rect x="340" y="410" width="560" height="460" rx="14" fill="url(#linen)"/>
  <rect x="340" y="410" width="48" height="460" fill="{GRAF}" opacity=".12"/>
  <rect x="520" y="560" width="250" height="130" rx="6" fill="{LINHO}"/>
  {text(645, 618, 'memórias', 38, GRAF)}{text(645, 660, 'da Luna', 26, '#6d655d', 'Helvetica, Arial, sans-serif')}
  <path d="M760 410v520l-18-22-18 22V410Z" fill="#b7826a"/>
</g>'''
S['caderno-memorias-1'] = scene(nb + sprig(1030, 1050, 1, -20), horizon=0)
S['caderno-memorias-2'] = scene(
    shadow(600, 930, 470, 46, .25)
    + f'<path d="M110 360 600 420v520L110 880Z" fill="#fbfaf6"/><path d="M1090 360 600 420v520l490-60Z" fill="#fffefb"/>'
    + f'<path d="M600 420v520" stroke="{AREIA2}" stroke-width="4"/>'
    + ''.join(f'<path d="M190 {520+i*58} 540 {552+i*58}" stroke="#ddd5c6" stroke-width="3"/>' for i in range(6))
    + text(360, 490, 'O que eu mais', 30, SALVIA_F, extra='transform="rotate(5 360 490)"') + text(360, 528, 'gostava em você', 30, SALVIA_F, extra='transform="rotate(5 360 528)"')
    + f'<rect x="680" y="480" width="330" height="260" fill="{SALVIA_CL}" transform="rotate(-3 845 610)"/>' + f'<g transform="rotate(-3 845 610)">' + cat(845, 640, .55) + '</g>'
    + text(845, 820, 'nosso cantinho preferido', 24, '#6d655d', 'Helvetica, Arial, sans-serif', extra='transform="rotate(-3 845 820)"'),
    horizon=0)

# 4. Caixa de recordações
S['caixa-recordacoes-1'] = scene(
    shadow(600, 930, 360, 40, .3)
    + f'<path d="M270 600h660v300H270Z" fill="url(#wood)"/><rect x="270" y="600" width="660" height="300" fill="url(#grain)"/>'
    + f'<path d="M250 520h700l-20 80H270Z" fill="{MADEIRA}"/><path d="M250 520h700v18H250Z" fill="#d7b088"/>'
    + f'<rect x="450" y="695" width="300" height="120" rx="8" fill="#e6c9a4" opacity=".55"/>'
    + text(600, 755, 'Thor', 56, '#5e4127') + text(600, 792, 'para sempre por perto', 22, '#5e4127', 'Helvetica, Arial, sans-serif')
    + sprig(1000, 1040, .9, 15),
    horizon=820)
S['caixa-recordacoes-2'] = scene(
    shadow(600, 950, 380, 40, .3)
    + f'<path d="M270 620h660v300H270Z" fill="url(#wood)"/><rect x="270" y="620" width="660" height="300" fill="url(#grain)"/>'
    + f'<path d="M300 640h600v40H300Z" fill="{MADEIRA3}" opacity=".5"/>'
    + f'<path d="M270 620 330 300h700l-100 320Z" fill="{MADEIRA}" opacity=".95"/><rect x="380" y="340" width="520" height="230" fill="url(#grain)" transform="skewX(-10)"/>'
    + f'<path d="M360 650c80-50 300-60 420-20" stroke="#b5574a" stroke-width="30" fill="none" stroke-linecap="round"/>'
    + f'<circle cx="790" cy="640" r="26" fill="url(#silver)"/>'
    + f'<ellipse cx="560" cy="690" rx="70" ry="40" fill="#6f9bb7"/><path d="M500 690c40-30 80-30 120 0" stroke="#f6f5f0" stroke-width="5" fill="none"/>',
    horizon=840)

# 5. Pingente gravado
S['pingente-gravado-1'] = scene(
    f'<rect width="1200" height="1200" fill="{SALVIA_CL}"/>'
    + ''.join(f'<path d="M0 {i*60}C300 {i*60-30} 900 {i*60+30} 1200 {i*60}" stroke="#d2ddd3" stroke-width="2" fill="none"/>' for i in range(21))
    + '<path d="M260 140C420 520 560 560 600 560S780 520 940 140" stroke="url(#silver)" stroke-width="7" fill="none" stroke-dasharray="14 6"/>'
    + shadow(615, 830, 190, 34, .25)
    + '<circle cx="600" cy="680" r="200" fill="url(#silver)"/><circle cx="600" cy="680" r="182" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>'
    + '<rect x="585" y="545" width="30" height="40" rx="10" fill="none" stroke="#a9adb0" stroke-width="9"/>'
    + text(600, 690, 'Bento', 70, '#6b7074', extra='font-style="italic"') + text(600, 745, '♡', 40, '#6b7074'),
    floor=False)

# 6. Placa memorial para jardim
S['placa-jardim-1'] = scene(
    f'<rect y="700" width="1200" height="500" fill="#c9b79b"/>'
    + ''.join(f'<path d="M{x} 1200C{x+10} 1000 {x-30} 860 {x+20} {700+ (x*37)%140}" stroke="{SALVIA if i%2 else SALVIA_F}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>' for i, x in enumerate(range(20, 1200, 46)))
    + shadow(600, 940, 330, 40, .35)
    + '<path d="M300 520c0-40 30-70 70-70h460c40 0 70 30 70 70v360H300Z" fill="#d9d4cb"/>'
    + '<path d="M300 520c0-40 30-70 70-70h460c40 0 70 30 70 70v26H300Z" fill="#e6e2da"/>'
    + text(600, 650, 'Nina', 92, '#7b746a') + text(600, 720, 'aqui o sol bate primeiro', 30, '#7b746a', 'Helvetica, Arial, sans-serif')
    + ''.join(f'<path d="M{x} 1200C{x+20} 1060 {x-20} 960 {x+30} {880+(x*13)%60}" stroke="{SALVIA}" stroke-width="12" fill="none" stroke-linecap="round"/>' for x in range(260, 960, 38)),
    floor=False)

# 7. Porta-retrato de madeira
S['porta-retrato-1'] = scene(
    shadow(600, 860, 250, 26, .3)
    + f'<path d="M680 830 760 440" stroke="{MADEIRA3}" stroke-width="16"/>'
    + frame(390, 300, 420, 540, f'<rect x="450" y="360" width="300" height="420" fill="url(#sky)"/><path d="M450 700c90-60 210-60 300 0v80H450Z" fill="{SALVIA}"/>' + cat(600, 640, .65, fur='#2f2c2a', light='#e9e5de'), border='url(#wood)', bw=30, matw=30, clip='c7')
    + sprig(220, 1030, 1.1, -6) + sprig(270, 1040, .8, -24, NEVOA),
    horizon=820)

# 8. Livro de memórias
S['livro-memorias-1'] = scene(
    shadow(520, 900, 340, 44, .3)
    + f'<g transform="translate(-110 0) rotate(4 600 700)"><rect x="250" y="520" width="700" height="360" rx="8" fill="#ece6da"/><rect x="250" y="520" width="700" height="24" fill="#d8cfbf"/>'
    + f'<rect x="240" y="470" width="720" height="70" rx="8" fill="{NEVOA}"/>'
    + f'<rect x="230" y="400" width="740" height="90" rx="8" fill="{SALVIA_F}"/>'
    + f'<rect x="460" y="420" width="280" height="50" rx="4" fill="{LINHO}"/>' + text(600, 455, 'nossa história', 28, GRAF) + '</g>'
    + f'<g transform="rotate(-8 900 860)">' + shadow(900, 1000, 150, 20, .3) + '<rect x="760" y="700" width="280" height="300" fill="#fff"/><rect x="780" y="720" width="240" height="210" fill="#dfe7e0"/><clipPath id="c8"><rect x="780" y="720" width="240" height="210"/></clipPath><g clip-path="url(#c8)">' + dog(900, 850, .48, fur='#efe7da', dark='#cbb89a') + '</g>' + text(900, 972, 'praia, 2019', 24, '#6d655d', 'Helvetica, Arial, sans-serif') + '</g>',
    horizon=700)
S['livro-memorias-2'] = scene(
    shadow(600, 960, 500, 40, .22)
    + '<path d="M80 420 600 470v460L80 880Z" fill="#fffdf8"/><path d="M1120 420 600 470v460l520-50Z" fill="#fffefb"/>'
    + f'<rect x="140" y="500" width="400" height="300" fill="{NEVOA_CL}"/>' + cat(340, 650, .7, fur='#d9a45f', light='#f2dcbc')
    + f'<rect x="660" y="500" width="190" height="170" fill="{SALVIA_CL}"/>' + dog(755, 590, .4)
    + f'<rect x="870" y="500" width="190" height="170" fill="{AREIA}"/>' + sprig(960, 660, .45, 10)
    + ''.join(f'<path d="M670 {720+i*40}h380" stroke="#ddd5c6" stroke-width="3"/>' for i in range(4)),
    horizon=0)

# 9. Cartões de acolhimento
S['cartoes-acolhimento-1'] = scene(
    f'<rect width="1200" height="1200" fill="{AREIA}"/>'
    + shadow(640, 880, 360, 40, .25)
    + f'<g transform="rotate(-10 450 640)"><rect x="230" y="420" width="440" height="460" fill="{NEVOA}"/><path d="M230 420 450 600 670 420" fill="none" stroke="#4d616d" stroke-width="4"/></g>'
    + f'<g transform="rotate(6 700 600)"><rect x="470" y="300" width="460" height="600" fill="#fffdf8"/>'
    + sprig(700, 640, .9, 0) + text(700, 760, 'Pensando em você', 40, GRAF) + text(700, 806, 'e em quem foi tão amado', 24, '#6d655d', 'Helvetica, Arial, sans-serif') + '</g>'
    + f'<g transform="rotate(-3 960 900)"><rect x="840" y="820" width="260" height="170" fill="{SALVIA_CL}"/></g>',
    floor=False)

# 10. Kit acolhimento
S['kit-acolhimento-1'] = scene(
    shadow(600, 960, 470, 44, .3)
    + f'<rect x="150" y="560" width="900" height="400" rx="10" fill="#efe9de"/><rect x="150" y="560" width="900" height="400" rx="10" fill="none" stroke="{AREIA2}" stroke-width="6"/>'
    + ''.join(f'<path d="M{170+i*24} 600l20 340" stroke="#e2d6c1" stroke-width="5" opacity=".7"/>' for i in range(36))
    + f'<g transform="rotate(-6 380 680)"><rect x="210" y="470" width="320" height="400" rx="10" fill="url(#linen)"/><rect x="290" y="580" width="160" height="80" rx="4" fill="{LINHO}"/>' + text(370, 628, 'memórias', 24, GRAF) + '</g>'
    + f'<g transform="rotate(5 720 660)"><rect x="580" y="450" width="260" height="360" fill="#fffdf8"/>' + sprig(710, 700, .55, 0) + text(710, 760, 'com carinho', 26, GRAF) + '</g>'
    + f'<g transform="rotate(-4 940 700)"><rect x="860" y="560" width="150" height="230" rx="6" fill="{NEVOA}"/><rect x="880" y="600" width="110" height="80" fill="{NEVOA_CL}"/>' + text(935, 650, 'sementes', 18, GRAF, 'Helvetica, Arial, sans-serif') + text(935, 674, 'de girassol', 16, GRAF, 'Helvetica, Arial, sans-serif') + '</g>'
    + f'<path d="M150 760h900" stroke="#b5574a" stroke-width="16" opacity=".85"/>',
    horizon=820)

only = set(sys.argv[1:])
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg = b.new_page(viewport={'width': 1200, 'height': 1200})
    for name, svg in S.items():
        if only and name not in only:
            continue
        pg.set_content(f'<html><body style="margin:0">{svg}</body></html>')
        png = OUT / f'{name}.png'
        pg.screenshot(path=str(png), clip={'x': 0, 'y': 0, 'width': 1200, 'height': 1200})
        Image.open(png).convert('RGB').save(OUT / f'{name}.webp', 'WEBP', quality=84, method=6)
        png.unlink()
        print('ok', name)
    b.close()
