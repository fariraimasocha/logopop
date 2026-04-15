import * as Lucide from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const {
  Apple,
  Ghost,
  Sparkles,
  Rocket,
  Heart,
  Star,
  Zap,
  Flame,
  Cloud,
  Crown,
  Sun,
  Moon,
  Leaf,
  Bird,
  Coffee,
  Camera,
  Music,
  Gamepad2,
  Bot,
  Gem,
} = Lucide

export const ICONS: Array<{ name: string; Icon: LucideIcon }> = [
  { name: 'Apple', Icon: Apple },
  { name: 'Ghost', Icon: Ghost },
  { name: 'Sparkles', Icon: Sparkles },
  { name: 'Rocket', Icon: Rocket },
  { name: 'Heart', Icon: Heart },
  { name: 'Star', Icon: Star },
  { name: 'Zap', Icon: Zap },
  { name: 'Flame', Icon: Flame },
  { name: 'Cloud', Icon: Cloud },
  { name: 'Crown', Icon: Crown },
  { name: 'Sun', Icon: Sun },
  { name: 'Moon', Icon: Moon },
  { name: 'Leaf', Icon: Leaf },
  { name: 'Bird', Icon: Bird },
  { name: 'Coffee', Icon: Coffee },
  { name: 'Camera', Icon: Camera },
  { name: 'Music', Icon: Music },
  { name: 'Gamepad2', Icon: Gamepad2 },
  { name: 'Bot', Icon: Bot },
  { name: 'Gem', Icon: Gem },
]

export const PRESETS: Array<{
  name: string
  Icon: LucideIcon
  bgGradientFrom: string
  bgGradientTo: string
}> = [
  { name: 'Apple', Icon: Apple, bgGradientFrom: '#f59e0b', bgGradientTo: '#ec4899' },
  { name: 'Flame', Icon: Flame, bgGradientFrom: '#fb923c', bgGradientTo: '#ef4444' },
  { name: 'Ghost', Icon: Ghost, bgGradientFrom: '#a855f7', bgGradientTo: '#6366f1' },
  { name: 'Leaf', Icon: Leaf, bgGradientFrom: '#84cc16', bgGradientTo: '#22c55e' },
]

const EXCLUDE = new Set([
  'Icon',
  'LucideIcon',
  'createLucideIcon',
  'default',
  'icons',
  'dynamicIconImports',
])

export const ALL_ICONS: Array<{ name: string; Icon: LucideIcon }> =
  Object.entries(Lucide)
    .filter(
      ([name, value]) =>
        /^[A-Z]/.test(name) &&
        !EXCLUDE.has(name) &&
        !name.endsWith('Icon') &&
        typeof value === 'object' &&
        value !== null &&
        ('$$typeof' in (value as object) || 'render' in (value as object)),
    )
    .map(([name, Icon]) => ({ name, Icon: Icon as LucideIcon }))
    .sort((a, b) => a.name.localeCompare(b.name))
