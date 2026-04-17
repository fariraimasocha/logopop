import { Italic } from 'lucide-react'
import { useLogo } from '../utils/logoState'
import { FONTS, findFont } from '../utils/fonts'
import { Slider } from './Slider'
import { ColorPicker } from './ColorPicker'

const WEIGHT_LABEL: Record<number, string> = {
  400: 'Regular',
  700: 'Bold',
  800: 'Extra',
  900: 'Black',
}

export function TextPanel() {
  const s = useLogo()
  const activeFont = findFont(s.fontFamily)

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-xs font-medium text-neutral-700">Text</div>
        <input
          type="text"
          value={s.text}
          onChange={(e) => s.set('text', e.target.value)}
          placeholder="Aa"
          maxLength={40}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-neutral-700">
          <span>Font</span>
          <span className="text-[10px] text-neutral-400">{FONTS.length} available</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => {
            const selected = s.fontFamily === f.family
            return (
              <button
                key={f.name}
                onClick={() => {
                  s.set('fontFamily', f.family)
                  if (!f.weights.includes(s.fontWeight)) {
                    s.set('fontWeight', f.weights.includes(700) ? 700 : f.weights[0])
                  }
                  if (!f.italic && s.italic) s.set('italic', false)
                }}
                className={`flex h-12 items-center justify-center rounded-lg border px-2 transition ${
                  selected
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                }`}
                style={{ fontFamily: f.family, fontWeight: 700 }}
                title={f.name}
              >
                <span className="truncate text-sm">{f.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium text-neutral-700">Weight</div>
        <div className="flex flex-wrap gap-1">
          {activeFont.weights.map((w) => (
            <button
              key={w}
              onClick={() => s.set('fontWeight', w)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                s.fontWeight === w
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
              }`}
            >
              {WEIGHT_LABEL[w] ?? w}
            </button>
          ))}
          <button
            onClick={() => activeFont.italic && s.set('italic', !s.italic)}
            disabled={!activeFont.italic}
            className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
              s.italic && activeFont.italic
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
            } ${!activeFont.italic ? 'cursor-not-allowed opacity-40' : ''}`}
            title={activeFont.italic ? 'Italic' : 'Italic not available'}
          >
            <Italic size={12} />
            Italic
          </button>
        </div>
      </div>

      <Slider label="Size" value={s.fontSize} min={40} max={400} onChange={(v) => s.set('fontSize', v)} />
      <Slider
        label="Letter spacing"
        value={s.letterSpacing}
        min={-20}
        max={40}
        step={0.5}
        onChange={(v) => s.set('letterSpacing', v)}
      />
      <Slider label="Rotate" value={s.rotate} min={0} max={360} unit="°" onChange={(v) => s.set('rotate', v)} />
      <ColorPicker label="Text color" value={s.textColor} onChange={(v) => s.set('textColor', v)} />
    </div>
  )
}
