type Props = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}

export function Slider({ label, value, min, max, step = 1, unit = 'px', onChange }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-neutral-700">
        <span>{label}</span>
        <span className="tabular-nums text-neutral-500">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900"
      />
    </div>
  )
}
