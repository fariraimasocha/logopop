/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toSvg } from 'html-to-image'
import { downloadLogo, resetDownloadThrottleForTests } from './download'

vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
  toSvg: vi.fn(),
}))

const mockedToSvg = vi.mocked(toSvg)

describe('downloadLogo', () => {
  beforeEach(() => {
    resetDownloadThrottleForTests()
    mockedToSvg.mockReset()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it('skips overlapping export work', async () => {
    let resolveExport: (value: string) => void
    mockedToSvg.mockReturnValue(
      new Promise<string>((resolve) => {
        resolveExport = resolve
      }),
    )

    const node = document.createElement('div')
    const firstDownload = downloadLogo(node, 'svg')

    await expect(downloadLogo(node, 'svg')).resolves.toBe(false)

    resolveExport!('data:image/svg+xml,<svg />')
    await expect(firstDownload).resolves.toBe(true)
    expect(mockedToSvg).toHaveBeenCalledTimes(1)
  })

  it('skips repeated exports during the cooldown window', async () => {
    mockedToSvg.mockResolvedValue('data:image/svg+xml,<svg />')

    const node = document.createElement('div')

    await expect(downloadLogo(node, 'svg')).resolves.toBe(true)
    await expect(downloadLogo(node, 'svg')).resolves.toBe(false)
    expect(mockedToSvg).toHaveBeenCalledTimes(1)
  })
})
