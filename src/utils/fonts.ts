import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/900.css'
import '@fontsource/inter/400-italic.css'
import '@fontsource/inter/700-italic.css'

import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/900.css'
import '@fontsource/poppins/400-italic.css'
import '@fontsource/poppins/700-italic.css'

import '@fontsource/outfit/400.css'
import '@fontsource/outfit/700.css'
import '@fontsource/outfit/900.css'

import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/700.css'

import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/400-italic.css'
import '@fontsource/dm-sans/700-italic.css'

import '@fontsource/manrope/400.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'

import '@fontsource/work-sans/400.css'
import '@fontsource/work-sans/700.css'
import '@fontsource/work-sans/900.css'
import '@fontsource/work-sans/400-italic.css'
import '@fontsource/work-sans/700-italic.css'

import '@fontsource/archivo/400.css'
import '@fontsource/archivo/700.css'
import '@fontsource/archivo/900.css'

import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/900.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/playfair-display/700-italic.css'

import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/fraunces/900.css'
import '@fontsource/fraunces/400-italic.css'
import '@fontsource/fraunces/700-italic.css'

import '@fontsource/bricolage-grotesque/400.css'
import '@fontsource/bricolage-grotesque/700.css'
import '@fontsource/bricolage-grotesque/800.css'

import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/jetbrains-mono/400-italic.css'
import '@fontsource/jetbrains-mono/700-italic.css'

export type FontDef = {
  name: string
  family: string
  weights: number[]
  italic: boolean
}

export const FONTS: FontDef[] = [
  { name: 'Inter', family: '"Inter", sans-serif', weights: [400, 700, 900], italic: true },
  { name: 'Poppins', family: '"Poppins", sans-serif', weights: [400, 700, 900], italic: true },
  { name: 'Outfit', family: '"Outfit", sans-serif', weights: [400, 700, 900], italic: false },
  { name: 'Space Grotesk', family: '"Space Grotesk", sans-serif', weights: [400, 700], italic: false },
  { name: 'DM Sans', family: '"DM Sans", sans-serif', weights: [400, 700], italic: true },
  { name: 'Manrope', family: '"Manrope", sans-serif', weights: [400, 700, 800], italic: false },
  { name: 'Work Sans', family: '"Work Sans", sans-serif', weights: [400, 700, 900], italic: true },
  { name: 'Archivo', family: '"Archivo", sans-serif', weights: [400, 700, 900], italic: false },
  { name: 'Playfair Display', family: '"Playfair Display", serif', weights: [400, 700, 900], italic: true },
  { name: 'Fraunces', family: '"Fraunces", serif', weights: [400, 700, 900], italic: true },
  { name: 'Bricolage Grotesque', family: '"Bricolage Grotesque", sans-serif', weights: [400, 700, 800], italic: false },
  { name: 'JetBrains Mono', family: '"JetBrains Mono", monospace', weights: [400, 700], italic: true },
]

export const DEFAULT_FONT = FONTS[0]

export function findFont(family: string): FontDef {
  return FONTS.find((f) => f.family === family) ?? DEFAULT_FONT
}
