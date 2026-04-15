import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="text-sm text-neutral-600">
        {children ?? <p>The page you are looking for does not exist.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="rounded-md bg-neutral-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-900 hover:bg-neutral-300"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
        >
          Start Over
        </Link>
      </div>
    </div>
  )
}
