import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Download, Flame, Undo2, Redo2 } from 'lucide-react'
import { useLogo } from '../utils/logoState'
import { PRESETS } from '../utils/icons'
import type { LogoFormat } from '../utils/download'

type Props = { onDownload: (format: LogoFormat) => void }

export function TopBar({ onDownload }: Props) {
  const s = useLogo()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const pick = (format: LogoFormat) => {
    setOpen(false)
    onDownload(format)
  }
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 text-neutral-900">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
          <Flame size={16} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold text-neutral-900">LogoPop</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          <button
            onClick={s.reset}
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
            title="Reset"
          >
            <Undo2 size={16} />
          </button>
          <button className="rounded-md p-1.5 text-neutral-300" title="Redo" disabled>
            <Redo2 size={16} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs font-medium text-neutral-500">Presets</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                s.set('iconName', p.name)
                s.set('Icon', p.Icon)
                s.set('bgType', 'gradient')
                s.set('bgGradientFrom', p.bgGradientFrom)
                s.set('bgGradientTo', p.bgGradientTo)
                s.set('borderColor', '#ffffff')
              }}
              className="flex h-7 w-7 transform-gpu items-center justify-center rounded-md shadow-sm ring-0 transition-[transform,box-shadow,filter] duration-[var(--duration-mid)] ease-[var(--ease-standard)] will-change-transform hover:-translate-y-0.5 hover:scale-110 hover:shadow-md hover:brightness-105 active:translate-y-0 active:scale-95 active:shadow-sm active:duration-[var(--duration-fast)] motion-reduce:transform-none motion-reduce:transition-none"
              style={{
                background: `linear-gradient(135deg, ${p.bgGradientFrom}, ${p.bgGradientTo})`,
              }}
              title={p.name}
            >
              <p.Icon size={14} color="#fff" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </div>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
        >
          <Download size={14} />
          Download
          <ChevronDown
            size={12}
            className={`transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="absolute right-0 top-[calc(100%+6px)] z-10 w-36 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
            <button
              onClick={() => pick('png')}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-100"
            >
              <span>PNG</span>
              <span className="text-[10px] text-neutral-400">Raster · 2×</span>
            </button>
            <button
              onClick={() => pick('svg')}
              className="flex w-full items-center justify-between border-t border-neutral-100 px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-100"
            >
              <span>SVG</span>
              <span className="text-[10px] text-neutral-400">Vector</span>
            </button>
            <button
              onClick={() => pick('ico')}
              className="flex w-full items-center justify-between border-t border-neutral-100 px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-100"
            >
              <span>ICO</span>
              <span className="text-[10px] text-neutral-400">Favicon</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
