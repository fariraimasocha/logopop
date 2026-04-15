import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            void router.invalidate()
          }}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className="rounded-md bg-neutral-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-900 hover:bg-neutral-300"
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className="rounded-md bg-neutral-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-900 hover:bg-neutral-300"
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}
