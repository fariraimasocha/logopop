import { createContext, useContext } from 'react'
import type { LucideIcon } from 'lucide-react'

export type ShadowKey = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const SHADOW_CLASS: Record<ShadowKey, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
}

export type LogoState = {
  iconName: string
  Icon: LucideIcon
  size: number
  rotate: number
  borderWidth: number
  borderColor: string
  fillColor: string
  fillOpacity: number
  bgRounded: number
  bgPadding: number
  bgShadow: ShadowKey
  bgType: 'solid' | 'gradient'
  bgSolid: string
  bgGradientFrom: string
  bgGradientTo: string
  bgGradientAngle: number
}

export type LogoActions = {
  set: <K extends keyof LogoState>(key: K, value: LogoState[K]) => void
  reset: () => void
}

export const LogoContext = createContext<(LogoState & LogoActions) | null>(null)

export function useLogo() {
  const ctx = useContext(LogoContext)
  if (!ctx) throw new Error('useLogo must be used inside LogoProvider')
  return ctx
}
