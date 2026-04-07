// Script para generar íconos PWA a partir de public/appicon.png
// Genera: pwa-192x192.png, pwa-512x512.png, maskable-512x512.png, apple-touch-icon.png

import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
const origen = resolve(publicDir, 'app-icon.png')

// Ícono estándar en dos tamaños
await sharp(origen).resize(192, 192).toFile(resolve(publicDir, 'pwa-192x192.png'))
console.log('✓ pwa-192x192.png')

await sharp(origen).resize(512, 512).toFile(resolve(publicDir, 'pwa-512x512.png'))
console.log('✓ pwa-512x512.png')

// Ícono maskable: imagen centrada con 10% de padding en cada lado
// La imagen ocupa el 80% del canvas (512 * 0.8 = 410px), centrada en 512x512
const tamañoCanvas = 512
const tamañoImagen = Math.round(tamañoCanvas * 0.8) // 410px

const imagenRedimensionada = await sharp(origen)
  .resize(tamañoImagen, tamañoImagen)
  .toBuffer()

const padding = Math.round((tamañoCanvas - tamañoImagen) / 2) // 51px

await sharp({
  create: {
    width: tamañoCanvas,
    height: tamañoCanvas,
    channels: 4,
    // Fondo crema igual al color de fondo del ícono original
    background: { r: 245, g: 240, b: 225, alpha: 1 },
  },
})
  .composite([{ input: imagenRedimensionada, top: padding, left: padding }])
  .png()
  .toFile(resolve(publicDir, 'maskable-512x512.png'))
console.log('✓ maskable-512x512.png')

// Apple touch icon (180x180)
await sharp(origen).resize(180, 180).toFile(resolve(publicDir, 'apple-touch-icon.png'))
console.log('✓ apple-touch-icon.png')

console.log('\nTodos los íconos generados en /public')
