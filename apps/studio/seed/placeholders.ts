import sharp from 'sharp'

/**
 * Genera imágenes de relleno (degradados tintados con una etiqueta) para el seed.
 * Así la web se puede maquetar con proporciones reales antes de tener las fotos.
 */

export type Ratio = 'portrait' | 'tall' | 'landscape' | 'square' | 'wide' | 'og'

const SIZES: Record<Ratio, [number, number]> = {
  portrait: [1600, 2000], // 4:5, retrato (portadas, lookbook)
  tall: [1400, 2100], // 2:3, retrato alto
  landscape: [2400, 1600], // 3:2, horizontal
  square: [1600, 1600], // 1:1
  wide: [2800, 1400], // 2:1, imagen a sangre
  og: [1200, 630], // al compartir en redes
}

/** Paleta: marfil, hueso, tinta y acentos cálidos (albero, terracota, rojo flamenca). */
export const TINTS = {
  marfil: ['#F4EFE6', '#DCCFBC'],
  hueso: ['#E9E1D3', '#BFAF97'],
  albero: ['#E8C9A0', '#B98A52'],
  terracota: ['#D9A38A', '#9E5A43'],
  flamenca: ['#C9534A', '#6E1F1C'],
  noche: ['#3A3430', '#151311'],
  oliva: ['#C8C3A2', '#7D7A5A'],
} as const

export type Tint = keyof typeof TINTS

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function placeholderImage(label: string, ratio: Ratio, tint: Tint): Promise<Buffer> {
  const [w, h] = SIZES[ratio]
  const [from, to] = TINTS[tint]
  const dark = tint === 'noche' || tint === 'flamenca'
  const fg = dark ? '#F4EFE6' : '#1C1A17'
  const fontSize = Math.round(Math.min(w, h) * 0.07)
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="v" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.18"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect x="${w * 0.06}" y="${h * 0.06}" width="${w * 0.88}" height="${h * 0.88}" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="${fg}" fill-opacity="0.85"
        font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" letter-spacing="${fontSize * 0.08}">${escapeXml(label.toUpperCase())}</text>
  <text x="50%" y="${h * 0.9}" text-anchor="middle" fill="${fg}" fill-opacity="0.5"
        font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(fontSize * 0.35)}" letter-spacing="4">ISABELA STUDIO · PLACEHOLDER · ${w}×${h}</text>
</svg>`
  return sharp(Buffer.from(svg)).jpeg({quality: 82, mozjpeg: true}).toBuffer()
}

/** Logo de relleno (texto) en PNG transparente. */
export async function placeholderLogo(): Promise<Buffer> {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#1C1A17"
        font-family="Georgia, 'Times New Roman', serif" font-size="120" letter-spacing="18">ISABELA</text>
  <text x="50%" y="85%" text-anchor="middle" fill="#1C1A17"
        font-family="Helvetica, Arial, sans-serif" font-size="34" letter-spacing="22">STUDIO</text>
</svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}
