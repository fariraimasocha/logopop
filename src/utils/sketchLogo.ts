import { createServerFn } from '@tanstack/react-start'
import type { ShadowKey } from './logoState'

export type LogoSketch = {
  svg: string
  bgGradientFrom: string
  bgGradientTo: string
  bgGradientAngle: number
  borderColor: string
  fillColor: string
  fillOpacity: number
  size: number
  rotate: number
  borderWidth: number
  bgRounded: number
  bgPadding: number
  bgShadow: ShadowKey
  rationale: string
}

const SYSTEM_PROMPT = `You are a logo designer. Given a short description of an app or product, sketch an original SVG mark and pick complementary background colors.

Return ONLY valid JSON, no markdown, no prose. Every numeric field must be a number, not a string.

Shape:
{
  "svg": "<svg viewBox=\\"0 0 24 24\\" xmlns=\\"http://www.w3.org/2000/svg\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">...</svg>",
  "bgGradientFrom": "#rrggbb",
  "bgGradientTo": "#rrggbb",
  "bgGradientAngle": <0-360 integer>,
  "borderColor": "#rrggbb (icon stroke; usually #ffffff on colored bgs)",
  "fillColor": "#rrggbb",
  "fillOpacity": <0-100 integer>,
  "size": <integer 140-340>,
  "rotate": <integer 0-360; usually 0>,
  "borderWidth": <number 1.5-3.5>,
  "bgRounded": <integer 0-200; 96-140 for app-icon look>,
  "bgPadding": <integer 24-120>,
  "bgShadow": "<one of: none, sm, md, lg, xl, 2xl>",
  "rationale": "<one sentence>"
}

Strict SVG rules:
- viewBox MUST be "0 0 24 24". No width/height attributes on the root <svg>.
- Allowed elements ONLY: svg, g, path, circle, rect, ellipse, line, polyline, polygon, defs, linearGradient, radialGradient, stop. No <script>, <style>, <image>, <foreignObject>, <use>, <text>.
- ALL stroke and fill values MUST be "currentColor" (color is driven by the app state). Do NOT hardcode hex or rgb inside the SVG.
- Do NOT set stroke-width (the app sets it). Do NOT add inline style=, event handlers (on*), href, xlink:*, or external references.
- Keep it minimal: at most 8 shape elements, balanced composition, clean geometric forms.
- Favor simple marks: monograms, abstract shapes, wordless glyphs. Avoid fine detail — LLMs are bad at it.

Guidelines:
- Playful apps get vivid gradients, serious apps get muted/monochrome, fitness gets energetic warm, finance gets cool blue/green.
- Prefer 2xl or xl shadow for depth.
- Default to 100-130 bgRounded; go lower (40-80) for sharper brands.`

const ALLOWED_TAGS = new Set([
  'svg',
  'g',
  'path',
  'circle',
  'rect',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'defs',
  'linearGradient',
  'radialGradient',
  'stop',
])

const ALLOWED_ATTRS = new Set([
  'viewBox',
  'xmlns',
  'fill',
  'stroke',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'fill-rule',
  'clip-rule',
  'd',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'width',
  'height',
  'points',
  'transform',
  'opacity',
  'fill-opacity',
  'stroke-opacity',
  'offset',
  'stop-color',
  'stop-opacity',
  'gradientUnits',
  'gradientTransform',
  'id',
])

const FORBIDDEN_ATTR_VALUE = /javascript:|data:|vbscript:|expression\s*\(|&#/i
const NON_LOCAL_URL = /url\s*\(\s*(?!#)/i

function sanitizeSvg(raw: string): string {
  const src = String(raw ?? '').trim()
  if (!src) throw new Error('Model returned empty SVG')

  if (/<!--|<!DOCTYPE|<\?/i.test(src)) {
    throw new Error('SVG contains forbidden markup')
  }
  if (/<\s*(script|style|image|foreignObject|use|text)\b/i.test(src)) {
    throw new Error('SVG contains forbidden elements')
  }
  if (/\son[a-z]+\s*=/i.test(src)) {
    throw new Error('SVG contains event handlers')
  }
  if (/\s(href|xlink:[a-z]+)\s*=/i.test(src)) {
    throw new Error('SVG contains forbidden references')
  }
  if (!/^<svg\b/i.test(src) || !/<\/svg>\s*$/i.test(src)) {
    throw new Error('SVG must be a single <svg>…</svg> element')
  }

  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b/g
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(src))) {
    if (!ALLOWED_TAGS.has(m[1])) {
      throw new Error(`SVG contains disallowed element: <${m[1]}>`)
    }
  }

  const attrRe = /\s([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g
  let a: RegExpExecArray | null
  while ((a = attrRe.exec(src))) {
    const name = a[1]
    const val = a[3] ?? a[4] ?? ''
    if (!ALLOWED_ATTRS.has(name)) {
      throw new Error(`SVG contains disallowed attribute: ${name}`)
    }
    if (FORBIDDEN_ATTR_VALUE.test(val) || NON_LOCAL_URL.test(val)) {
      throw new Error(`SVG attribute ${name} has forbidden value`)
    }
  }

  return src
}

export const sketchLogo = createServerFn({ method: 'POST' })
  .inputValidator((description: string) => {
    const clean = String(description ?? '').trim()
    if (!clean) throw new Error('Description is required')
    if (clean.length > 500) throw new Error('Description too long (max 500 chars)')
    return clean
  })
  .handler(async ({ data: description }): Promise<LogoSketch> => {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error('GROQ_API_KEY is not set')

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `App description: ${description}` },
        ],
      }),
    })

    if (!res.ok) {
      throw new Error(`Groq API request failed with status ${res.status}`)
    }

    const json = (await res.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const content = json.choices?.[0]?.message?.content ?? ''
    let parsed: LogoSketch
    try {
      parsed = JSON.parse(content)
    } catch {
      throw new Error('Model returned invalid JSON')
    }

    parsed.svg = sanitizeSvg(parsed.svg)

    const clamp = (v: unknown, min: number, max: number, fallback: number) => {
      const n = Number(v)
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
    }
    const validShadows = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    parsed.bgGradientAngle = clamp(parsed.bgGradientAngle, 0, 360, 135)
    parsed.fillOpacity = clamp(parsed.fillOpacity, 0, 100, 0)
    parsed.size = clamp(parsed.size, 40, 500, 240)
    parsed.rotate = clamp(parsed.rotate, 0, 360, 0)
    parsed.borderWidth = clamp(parsed.borderWidth, 0, 30, 2.3)
    parsed.bgRounded = clamp(parsed.bgRounded, 0, 256, 110)
    parsed.bgPadding = clamp(parsed.bgPadding, 0, 160, 48)
    if (!(validShadows as readonly string[]).includes(parsed.bgShadow)) {
      parsed.bgShadow = 'lg'
    }
    if (!parsed.fillColor) parsed.fillColor = parsed.borderColor

    return parsed
  })
