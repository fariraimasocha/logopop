import { useState } from 'react'
import { Loader2, Wand2 } from 'lucide-react'
import { suggestLogo } from '../utils/suggestLogo'
import { sketchLogo } from '../utils/sketchLogo'
import { useLogo } from '../utils/logoState'
import { ALL_ICONS } from '../utils/icons'

type Mode = 'icon' | 'sketch'

export function AiSuggest() {
  const s = useLogo()
  const [desc, setDesc] = useState('')
  const [mode, setMode] = useState<Mode>('icon')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rationale, setRationale] = useState<string | null>(null)

  const applyStyle = (result: {
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
  }) => {
    s.set('bgType', 'gradient')
    s.set('bgGradientFrom', result.bgGradientFrom)
    s.set('bgGradientTo', result.bgGradientTo)
    s.set('bgGradientAngle', result.bgGradientAngle)
    s.set('borderColor', result.borderColor)
    s.set('fillColor', result.fillColor)
    s.set('fillOpacity', result.fillOpacity)
    s.set('size', result.size)
    s.set('rotate', result.rotate)
    s.set('borderWidth', result.borderWidth)
    s.set('bgRounded', result.bgRounded)
    s.set('bgPadding', result.bgPadding)
    s.set('bgShadow', result.bgShadow)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!desc.trim() || loading) return
    setLoading(true)
    setError(null)
    setRationale(null)
    try {
      if (mode === 'sketch') {
        const result = await sketchLogo({ data: desc.trim() })
        s.set('mode', 'svg')
        s.set('customSvg', result.svg)
        applyStyle(result)
        setRationale(result.rationale)
      } else {
        const result = await suggestLogo({ data: desc.trim() })
        const found = ALL_ICONS.find((i) => i.name === result.iconName)
        if (found) {
          s.set('iconName', found.name)
          s.set('Icon', found.Icon)
        }
        s.set('mode', 'icon')
        s.set('customSvg', null)
        applyStyle(result)
        setRationale(result.rationale)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-3">
      <label className="text-xs font-semibold text-neutral-900">
        Describe your app
      </label>
      <div className="flex gap-1 rounded-md bg-neutral-100 p-0.5">
        {(['icon', 'sketch'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded px-2 py-1 text-[11px] font-semibold transition ${
              mode === m
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {m === 'sketch' ? 'Sketch (beta)' : 'AI Suggest'}
          </button>
        ))}
      </div>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder={
          mode === 'sketch'
            ? 'A bold monogram for a coffee app…'
            : 'A minimal habit tracker for runners…'
        }
        rows={2}
        maxLength={500}
        className="w-full resize-none rounded-md border border-neutral-200 bg-white p-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !desc.trim()}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-neutral-900 py-2 text-xs font-semibold text-white transition-[transform,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {mode === 'sketch' ? 'Sketching…' : 'Designing…'}
          </>
        ) : (
          <>
            <Wand2 size={14} />
            {mode === 'sketch' ? 'Sketch with AI' : 'Generate with AI'}
          </>
        )}
      </button>
      {mode === 'sketch' && !rationale && !error && (
        <p className="text-[10px] leading-snug text-neutral-500">
          Beta — the model sketches an original SVG mark. Quality varies; simple marks work best.
        </p>
      )}
      {rationale && (
        <p className="rounded-md bg-violet-50 px-2 py-1.5 text-[11px] leading-relaxed text-violet-900">
          {rationale}
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-50 px-2 py-1.5 text-[11px] text-red-700">{error}</p>
      )}
    </form>
  )
}
