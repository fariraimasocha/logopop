import { toPng, toSvg } from 'html-to-image'

export type LogoFormat = 'png' | 'svg' | 'ico'

const ICO_SIZES = [16, 32, 48, 64, 128, 256]
const DOWNLOAD_COOLDOWN_MS = 1500

let activeDownload: Promise<void> | null = null
let lastDownloadAt = 0

function trigger(href: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = href
  link.click()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function buildIco(node: HTMLElement): Promise<Blob> {
  const sourceUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
  })
  const img = await loadImage(sourceUrl)

  const pngs: Array<Uint8Array> = []
  for (const size of ICO_SIZES) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas 2d context unavailable')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, size, size)
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
    if (!blob) throw new Error('failed to encode png')
    pngs.push(new Uint8Array(await blob.arrayBuffer()))
  }

  const headerSize = 6
  const entrySize = 16
  const dirSize = headerSize + entrySize * ICO_SIZES.length
  const totalSize = dirSize + pngs.reduce((sum, p) => sum + p.byteLength, 0)
  const buf = new ArrayBuffer(totalSize)
  const view = new DataView(buf)
  const bytes = new Uint8Array(buf)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, ICO_SIZES.length, true)

  let dataOffset = dirSize
  for (let i = 0; i < ICO_SIZES.length; i++) {
    const size = ICO_SIZES[i]
    const png = pngs[i]
    const entry = headerSize + i * entrySize
    view.setUint8(entry + 0, size >= 256 ? 0 : size)
    view.setUint8(entry + 1, size >= 256 ? 0 : size)
    view.setUint8(entry + 2, 0)
    view.setUint8(entry + 3, 0)
    view.setUint16(entry + 4, 1, true)
    view.setUint16(entry + 6, 32, true)
    view.setUint32(entry + 8, png.byteLength, true)
    view.setUint32(entry + 12, dataOffset, true)
    bytes.set(png, dataOffset)
    dataOffset += png.byteLength
  }

  return new Blob([buf], { type: 'image/x-icon' })
}

export function resetDownloadThrottleForTests() {
  activeDownload = null
  lastDownloadAt = 0
}

async function runDownload(
  node: HTMLElement,
  format: LogoFormat,
  basename = 'logopop',
) {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready
  }
  if (format === 'png') {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
    })
    trigger(dataUrl, `${basename}.png`)
    return
  }
  if (format === 'ico') {
    const blob = await buildIco(node)
    const url = URL.createObjectURL(blob)
    try {
      trigger(url, 'favicon.ico')
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
    return
  }
  const dataUrl = await toSvg(node, { cacheBust: true })
  trigger(dataUrl, `${basename}.svg`)
}

export async function downloadLogo(
  node: HTMLElement,
  format: LogoFormat,
  basename = 'logopop',
): Promise<boolean> {
  const now = Date.now()
  if (activeDownload || now - lastDownloadAt < DOWNLOAD_COOLDOWN_MS) {
    return false
  }

  const task = runDownload(node, format, basename)
  activeDownload = task

  try {
    await task
    lastDownloadAt = Date.now()
    return true
  } finally {
    if (activeDownload === task) {
      activeDownload = null
    }
  }
}
