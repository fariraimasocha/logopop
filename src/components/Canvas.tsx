import { forwardRef } from 'react'
import { useLogo, SHADOW_CLASS } from '../utils/logoState'
import { CustomSvgIcon } from './CustomSvgIcon'

export const Canvas = forwardRef<HTMLDivElement>(function Canvas(_, ref) {
  const s = useLogo()
  const background =
    s.bgType === 'solid'
      ? s.bgSolid
      : `linear-gradient(${s.bgGradientAngle}deg, ${s.bgGradientFrom}, ${s.bgGradientTo})`

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] p-8">
      <div className="absolute left-1/2 top-8 -translate-x-1/2">
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
          Downloadable zone
        </span>
      </div>
      <div
        ref={ref}
        className={`flex items-center justify-center ${SHADOW_CLASS[s.bgShadow]}`}
        style={{
          width: 512,
          height: 512,
          borderRadius: s.bgRounded,
          padding: s.bgPadding,
          background,
        }}
      >
        {s.mode === 'svg' && s.customSvg ? (
          <CustomSvgIcon
            markup={s.customSvg}
            size={s.size}
            strokeWidth={s.borderWidth}
            color={s.borderColor}
            fillOpacity={s.fillOpacity / 100}
            rotate={s.rotate}
          />
        ) : s.mode === 'text' ? (
          <span
            style={{
              fontFamily: s.fontFamily,
              fontWeight: s.fontWeight,
              fontSize: s.fontSize,
              letterSpacing: s.letterSpacing,
              fontStyle: s.italic ? 'italic' : 'normal',
              color: s.textColor,
              lineHeight: 1,
              whiteSpace: 'pre',
              transform: `rotate(${s.rotate}deg)`,
              display: 'inline-block',
            }}
          >
            {s.text || ' '}
          </span>
        ) : (
          <s.Icon
            size={s.size}
            strokeWidth={s.borderWidth}
            color={s.borderColor}
            fill={s.fillColor}
            fillOpacity={s.fillOpacity / 100}
            style={{ transform: `rotate(${s.rotate}deg)` }}
            absoluteStrokeWidth
          />
        )}
      </div>
    </div>
  )
})
