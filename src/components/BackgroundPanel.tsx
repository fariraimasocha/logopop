import { useLogo, type ShadowKey } from '../utils/logoState'
import { Slider } from './Slider'
import { ColorPicker } from './ColorPicker'

const SHADOWS: ShadowKey[] = ['none', 'sm', 'md', 'lg', 'xl', '2xl']
const SWATCHES = [
  '#f43f5e', '#f97316', '#eab308', '#84cc16', '#22c55e',
  '#14b8a6', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899',
  '#0a0a0a', '#737373', '#d4d4d4', '#ffffff',
]

export function BackgroundPanel() {
  const s = useLogo()
  return (
    <div className="space-y-6">
      <Slider label="Rounded" value={s.bgRounded} min={0} max={256} onChange={(v) => s.set('bgRounded', v)} />
      <Slider label="Padding" value={s.bgPadding} min={0} max={160} onChange={(v) => s.set('bgPadding', v)} />
      <div>
        <div className="mb-2 text-xs font-medium text-neutral-700">Shadow</div>
        <div className="grid grid-cols-6 gap-1">
          {SHADOWS.map((sh) => (
            <button
              key={sh}
              onClick={() => s.set('bgShadow', sh)}
              className={`rounded-md border px-2 py-1.5 text-[10px] font-semibold uppercase transition ${
                s.bgShadow === sh
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {sh}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs font-medium text-neutral-700">Background</div>
        <div className="mb-3 flex gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
          <button
            onClick={() => s.set('bgType', 'solid')}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
              s.bgType === 'solid' ? 'bg-white shadow-sm' : 'text-neutral-500'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => s.set('bgType', 'gradient')}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
              s.bgType === 'gradient' ? 'bg-white shadow-sm' : 'text-neutral-500'
            }`}
          >
            Gradient
          </button>
        </div>
        {s.bgType === 'solid' ? (
          <ColorPicker label="Color" value={s.bgSolid} onChange={(v) => s.set('bgSolid', v)} />
        ) : (
          <div className="space-y-3">
            <ColorPicker label="From" value={s.bgGradientFrom} onChange={(v) => s.set('bgGradientFrom', v)} />
            <ColorPicker label="To" value={s.bgGradientTo} onChange={(v) => s.set('bgGradientTo', v)} />
            <Slider
              label="Angle"
              value={s.bgGradientAngle}
              min={0}
              max={360}
              unit="°"
              onChange={(v) => s.set('bgGradientAngle', v)}
            />
          </div>
        )}
      </div>
      <div>
        <div className="mb-2 text-xs font-medium text-neutral-700">Swatches</div>
        <div className="grid grid-cols-7 gap-1.5">
          {SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => {
                if (s.bgType === 'solid') s.set('bgSolid', c)
                else s.set('bgGradientFrom', c)
              }}
              className="aspect-square rounded-md border border-neutral-200 transition hover:scale-110"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
