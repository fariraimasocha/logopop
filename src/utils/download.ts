import { toPng, toSvg } from 'html-to-image'

export type LogoFormat = 'png' | 'svg'

function trigger(href: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = href
  link.click()
}

export async function downloadLogo(
  node: HTMLElement,
  format: LogoFormat,
  basename = 'logopop',
) {
  if (format === 'png') {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: 'transparent',
    })
    trigger(dataUrl, `${basename}.png`)
    return
  }
  const dataUrl = await toSvg(node, { cacheBust: true })
  trigger(dataUrl, `${basename}.svg`)
}
