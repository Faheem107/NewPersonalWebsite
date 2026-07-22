import Link from 'next/link'
import Wash from '@/components/backdrop/wash'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <Wash variant="saddle" />
      <div className="text-center">
        <p className="caption">404</p>
        <h1 className="mt-4 font-display text-[length:var(--text-h1)]">
          There is nothing at this address
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page may have moved, or the link may have been mistyped.
        </p>
        <Link href="/" className="rule-link wght-link mt-8 inline-block">
          Back to the start
        </Link>
      </div>
    </main>
  )
}
