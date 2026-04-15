import { createServerFn } from '@tanstack/react-start'
import { LUCIDE_ICON_NAMES } from './lucideNames'

export type LogoSuggestion = {
  iconName: string
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
  bgShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  rationale: string
}

const SYSTEM_PROMPT = `You are a logo designer. Given a short description of an app or product, design a complete app-icon-style logo.

Return ONLY valid JSON, no markdown, no prose. Every numeric field must be a number, not a string.

Shape:
{
  "iconName": "<exact lucide-react PascalCase name from provided list>",
  "bgGradientFrom": "#rrggbb",
  "bgGradientTo": "#rrggbb",
  "bgGradientAngle": <0-360 integer, gradient direction>,
  "borderColor": "#rrggbb (icon stroke; usually #ffffff on colored bgs, #0a0a0a on light bgs)",
  "fillColor": "#rrggbb (icon fill; matches borderColor when fillOpacity > 0)",
  "fillOpacity": <0-100 integer; 0 for outline-only, ~20 for subtle tint, 100 for solid>,
  "size": <integer 140-340; icon size in px; larger for simple shapes, smaller for busy ones>,
  "rotate": <integer 0-360; usually 0 unless rotation adds meaning>,
  "borderWidth": <number 1.5-3.5; stroke thickness>,
  "bgRounded": <integer 0-200; app-icon style is usually 96-140>,
  "bgPadding": <integer 24-120; padding between icon and background edge>,
  "bgShadow": "<one of: none, sm, md, lg, xl, 2xl>",
  "rationale": "<one sentence explaining the choices>"
}

Guidelines:
- Pick mood-appropriate colors: playful apps get vivid gradients, serious apps get muted/monochrome, fitness gets energetic warm, finance gets cool blue/green.
- Prefer 2xl or xl shadow for depth.
- Default to 100-130 bgRounded for a modern app-icon look; go lower (40-80) for sharper brands.
- fillOpacity=0 reads as clean/outline, fillOpacity=100 reads as bold/solid. Pick what matches the brand tone.`

export const suggestLogo = createServerFn({ method: 'POST' })
  .inputValidator((description: string) => {
    const clean = String(description ?? '').trim()
    if (!clean) throw new Error('Description is required')
    if (clean.length > 500) throw new Error('Description too long (max 500 chars)')
    return clean
  })
  .handler(async ({ data: description }): Promise<LogoSuggestion> => {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error('GROQ_API_KEY is not set')

    const iconNames = LUCIDE_ICON_NAMES
    const iconSample = iconNames.join(', ')

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
          {
            role: 'user',
            content: `App description: ${description}\n\nPick from these lucide icon names (must match exactly): ${iconSample}`,
          },
        ],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Groq API error ${res.status}: ${body.slice(0, 200)}`)
    }

    const json = (await res.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const content = json.choices?.[0]?.message?.content ?? ''
    let parsed: LogoSuggestion
    try {
      parsed = JSON.parse(content)
    } catch {
      throw new Error('Model returned invalid JSON')
    }

    if (!iconNames.includes(parsed.iconName)) {
      const lower = parsed.iconName.toLowerCase()
      const match = iconNames.find((n) => n.toLowerCase() === lower)
      parsed.iconName = match ?? 'Sparkles'
    }

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
    if (!validShadows.includes(parsed.bgShadow)) parsed.bgShadow = 'lg'
    if (!parsed.fillColor) parsed.fillColor = parsed.borderColor

    return parsed
  })
