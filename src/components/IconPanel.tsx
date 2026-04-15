import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useLogo } from '../utils/logoState'
import { ICONS, ALL_ICONS } from '../utils/icons'
import { Slider } from './Slider'
import { ColorPicker } from './ColorPicker'
import { AiSuggest } from './AiSuggest'

const MAX_RESULTS = 120

export function IconPanel() {
  const s = useLogo()
  const [query, setQuery] = useState('')

  const { list, totalMatches } = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { list: ICONS, totalMatches: ICONS.length }
    const all = ALL_ICONS.filter((i) => i.name.toLowerCase().includes(q))
    return { list: all.slice(0, MAX_RESULTS), totalMatches: all.length }
  }, [query])

  return (
    <div className="space-y-6">
      <AiSuggest />
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-neutral-700">
          <span>Icon</span>
          <span className="text-[10px] text-neutral-400">{ALL_ICONS.length} available</span>
        </div>
        <div className="relative mb-3">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {list.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            No icons match "{query}"
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {list.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => {
                  s.set('iconName', name)
                  s.set('Icon', Icon)
                }}
                className={`flex aspect-square items-center justify-center rounded-lg border transition ${
                  s.iconName === name
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                }`}
                title={name}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        )}
        {query && totalMatches > MAX_RESULTS && (
          <p className="mt-2 text-[10px] text-neutral-400">
            Showing {MAX_RESULTS} of {totalMatches} — refine to narrow.
          </p>
        )}
      </div>
      <Slider label="Size" value={s.size} min={40} max={500} onChange={(v) => s.set('size', v)} />
      <Slider label="Rotate" value={s.rotate} min={0} max={360} unit="°" onChange={(v) => s.set('rotate', v)} />
      <Slider
        label="Border width"
        value={s.borderWidth}
        min={0}
        max={30}
        step={0.1}
        onChange={(v) => s.set('borderWidth', v)}
      />
      <ColorPicker label="Border color" value={s.borderColor} onChange={(v) => s.set('borderColor', v)} />
      <Slider
        label="Fill opacity"
        value={s.fillOpacity}
        min={0}
        max={100}
        unit="%"
        onChange={(v) => s.set('fillOpacity', v)}
      />
      <ColorPicker label="Fill color" value={s.fillColor} onChange={(v) => s.set('fillColor', v)} />
    </div>
  )
}
