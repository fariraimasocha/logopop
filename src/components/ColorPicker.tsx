type Props = {
  label: string
  value: string
  onChange: (v: string) => void
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

export function ColorPicker({ label, value, onChange }: Props) {
  const [r, g, b] = hexToRgb(value)
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-neutral-700">{label}</div>
      <div className="flex items-center gap-2">
        <label className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-lg border border-neutral-200">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-[200%] w-[200%] cursor-pointer opacity-0"
          />
          <div className="h-full w-full" style={{ background: value }} />
        </label>
        <input
          type="text"
          value={value.replace('#', '')}
          onChange={(e) => {
            const v = '#' + e.target.value.replace('#', '').slice(0, 6)
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v)
          }}
          className="w-20 rounded-md bg-neutral-900 px-2 py-1.5 text-xs text-white tabular-nums"
        />
        <input
          type="number"
          min={0}
          max={255}
          value={r}
          onChange={(e) => onChange(rgbToHex(Number(e.target.value), g, b))}
          className="w-12 rounded-md bg-neutral-900 px-2 py-1.5 text-xs text-white tabular-nums"
        />
        <input
          type="number"
          min={0}
          max={255}
          value={g}
          onChange={(e) => onChange(rgbToHex(r, Number(e.target.value), b))}
          className="w-12 rounded-md bg-neutral-900 px-2 py-1.5 text-xs text-white tabular-nums"
        />
        <input
          type="number"
          min={0}
          max={255}
          value={b}
          onChange={(e) => onChange(rgbToHex(r, g, Number(e.target.value)))}
          className="w-12 rounded-md bg-neutral-900 px-2 py-1.5 text-xs text-white tabular-nums"
        />
      </div>
    </div>
  )
}
