/**
 * Genera imágenes de prueba (public/fixtures) y su manifiesto con dimensiones + LQIP.
 * Se usan mientras no haya proyecto de Sanity configurado. Ejecutar: node scripts/make-fixtures.mjs
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const OUT = new URL('../public/fixtures/', import.meta.url);
const MANIFEST = new URL('../src/lib/sanity/fixtures-manifest.json', import.meta.url);

// [nombre, ancho, alto, color A, color B, etiqueta]
const IMAGES = [
  ['cover-azahar', 1600, 2000, '#c9b8a3', '#7a5a45', 'Azahar — portada'],
  ['look-01', 1400, 2100, '#d8c7b4', '#9b6b52', 'Look 01'],
  ['look-02', 1400, 2100, '#b9a593', '#5e4637', 'Look 02'],
  ['look-03', 1400, 2100, '#e3d6c6', '#a8826a', 'Look 03'],
  ['look-04', 1400, 2100, '#cdb9a6', '#6f4f3e', 'Look 04'],
  ['look-05', 1400, 2100, '#d6c3ae', '#8a5d48', 'Look 05'],
  ['look-06', 1400, 2100, '#c2ae9a', '#4e3a2e', 'Look 06'],
  ['wide-taller', 2400, 1350, '#bfae9c', '#3d3029', 'Taller — a sangre'],
  ['wide-tejidos', 2400, 1600, '#e0cfb9', '#b07a5a', 'Tejidos'],
  ['mood-01', 1200, 1500, '#e8dccb', '#c4a283', 'Moodboard 01'],
  ['mood-02', 1500, 1200, '#d9c2a5', '#8c6a50', 'Moodboard 02'],
  ['mood-03', 1200, 1200, '#efe4d4', '#b8957a', 'Moodboard 03'],
  ['mood-04', 1200, 1600, '#cbb49a', '#6b5141', 'Moodboard 04'],
  ['mood-05', 1600, 1200, '#e4d3bd', '#9f7357', 'Moodboard 05'],
  ['sketch-01', 1200, 1600, '#f4efe6', '#d9cdbb', 'Boceto 01'],
  ['sketch-02', 1200, 1600, '#f2ece2', '#d2c4b0', 'Boceto 02'],
  ['sketch-03', 1200, 1600, '#f5f0e8', '#dccfbd', 'Boceto 03'],
  ['sketch-04', 1200, 1600, '#f1eadf', '#cfc0aa', 'Boceto 04'],
  ['patron-01', 1600, 2000, '#d4c4b0', '#806250', 'Patronaje'],
  ['patron-02', 1600, 1200, '#c8b49e', '#5d4536', 'Confección'],
  ['home-01', 1600, 2000, '#cbb7a2', '#6e4c3b', 'Inicio 01'],
  ['home-02', 1600, 1200, '#dccab5', '#94684f', 'Inicio 02'],
  ['home-03', 1400, 2100, '#bfa995', '#4f3b2f', 'Inicio 03'],
  ['home-04', 1400, 1400, '#e2d2be', '#a37a5f', 'Inicio 04'],
  ['hero-poster', 1920, 1080, '#a89480', '#2e2520', 'Vídeo de proceso'],
  ['pret-cover', 1600, 2000, '#d7d0c6', '#55504a', 'Prêt-à-porter — portada'],
];

const svg = ([, w, h, a, b, label]) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="${w * 0.06}" y="${h * 0.06}" width="${w * 0.88}" height="${h * 0.88}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Georgia, serif" font-style="italic"
    font-size="${Math.round(Math.min(w, h) / 14)}" fill="#fff" fill-opacity=".85">${label}</text>
  <text x="50%" y="${h * 0.9}" text-anchor="middle" font-family="Arial, sans-serif" letter-spacing="6"
    font-size="${Math.round(Math.min(w, h) / 50)}" fill="#fff" fill-opacity=".6">IMAGEN DE PRUEBA · ${w}×${h}</text>
</svg>`;

await mkdir(OUT, { recursive: true });
const manifest = {};
for (const img of IMAGES) {
  const [name, w, h] = img;
  const buf = Buffer.from(svg(img));
  await sharp(buf).jpeg({ quality: 72, mozjpeg: true }).toFile(new URL(`${name}.jpg`, OUT).pathname.replace(/^\/([A-Z]:)/, '$1'));
  const lqip = await sharp(buf).resize(20).jpeg({ quality: 50 }).toBuffer();
  manifest[name] = {
    url: `/fixtures/${name}.jpg`,
    width: w,
    height: h,
    lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`,
  };
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${IMAGES.length} imágenes de prueba generadas.`);
