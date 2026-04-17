import { useRef, useState } from 'react'
import { Apple } from 'lucide-react'
import { LogoContext, type LogoState, type ShadowKey } from '../utils/logoState'
import { DEFAULT_FONT } from '../utils/fonts'
import { TopBar } from './TopBar'
import { IconPanel } from './IconPanel'
import { TextPanel } from './TextPanel'
import { BackgroundPanel } from './BackgroundPanel'
import { Canvas } from './Canvas'
import { MyApps } from './MyApps'
import { downloadLogo, type LogoFormat } from '../utils/download'

type Tab = 'icon' | 'text' | 'background'

const DEFAULT_STATE: LogoState = {
  mode: 'icon',
  customSvg: null,
  iconName: 'Apple',
  Icon: Apple,
  size: 260,
  rotate: 0,
  borderWidth: 20.3,
  borderColor: '#ffffff',
  fillColor: '#ffffff',
  fillOpacity: 0,
  text: 'Aa',
  fontFamily: DEFAULT_FONT.family,
  fontWeight: 700,
  fontSize: 240,
  letterSpacing: -4,
  textColor: '#ffffff',
  italic: false,
  bgRounded: 96,
  bgPadding: 48,
  bgShadow: 'lg' as ShadowKey,
  bgType: 'gradient',
  bgSolid: '#f43f5e',
  bgGradientFrom: '#f59e0b',
  bgGradientTo: '#ec4899',
  bgGradientAngle: 135,
}

export function LogoBuilder() {
  const [state, setState] = useState<LogoState>(DEFAULT_STATE)
  const [tab, setTab] = useState<Tab>('icon')
  const canvasRef = useRef<HTMLDivElement>(null)

  const ctx = {
    ...state,
    set: <K extends keyof LogoState>(key: K, value: LogoState[K]) =>
      setState((s) => ({ ...s, [key]: value })),
    reset: () => setState(DEFAULT_STATE),
  }

  const selectTab = (t: Tab) => {
    setTab(t)
    if (t === 'icon') setState((s) => ({ ...s, mode: s.mode === 'text' ? 'icon' : s.mode }))
    if (t === 'text') setState((s) => ({ ...s, mode: 'text' }))
  }

  const handleDownload = (format: LogoFormat) => {
    if (canvasRef.current) void downloadLogo(canvasRef.current, format)
  }

  return (
    <LogoContext.Provider value={ctx}>
      <div className="flex h-screen flex-col bg-neutral-50">
        <TopBar onDownload={handleDownload} />
        <div className="flex flex-1 overflow-hidden">
          <aside className="flex w-[360px] flex-col border-r border-neutral-200 bg-white">
            <div className="flex border-b border-neutral-200">
              {(['icon', 'text', 'background'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => selectTab(t)}
                  className={`flex-1 border-b-2 px-4 py-3 text-xs font-semibold capitalize transition ${
                    tab === t
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'icon' ? <IconPanel /> : tab === 'text' ? <TextPanel /> : <BackgroundPanel />}
            </div>
            <div className="border-t border-neutral-200 p-4 text-[11px] text-neutral-400">
              App by <span className="underline">LogoPop</span> · Icons by{' '}
              <span className="underline">Lucide</span>
            </div>
          </aside>
          <main className="flex-1 overflow-hidden">
            <Canvas ref={canvasRef} />
          </main>
          <MyApps />
        </div>
      </div>
    </LogoContext.Provider>
  )
}
