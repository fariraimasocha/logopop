import { useMemo } from 'react'

type Props = {
  markup: string
  size: number
  strokeWidth: number
  color: string
  fillOpacity: number
  rotate: number
}

function escapeSvgAttr(value: string) {
  return value.replace(/[&"<>]/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      default:
        return char
    }
  })
}

export function CustomSvgIcon({ markup, size, strokeWidth, color, fillOpacity, rotate }: Props) {
  const svgSrc = useMemo(() => {
    const safeColor = escapeSvgAttr(color)
    return markup.replace(/^<svg\b([^>]*)>/i, (_match, attrs: string) => {
      const cleaned = attrs.replace(
        /\s(width|height|style|stroke-width|fill-opacity|color)\s*=\s*("[^"]*"|'[^']*')/gi,
        '',
      )
      return `<svg${cleaned} width="100%" height="100%" color="${safeColor}" stroke-width="${strokeWidth}" fill-opacity="${fillOpacity}">`
    })
  }, [markup, strokeWidth, fillOpacity, color])

  return (
    <div
      style={{
        width: size,
        height: size,
        color,
        transform: `rotate(${rotate}deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgSrc)}`}
        alt=""
        aria-hidden="true"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
