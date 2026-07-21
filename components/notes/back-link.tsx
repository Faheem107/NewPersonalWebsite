'use client'

import Link from 'next/link'
import { useStick } from '@/lib/motion/pointer'

export default function BackLink({ href, label }: { href: string; label: string }) {
  const stick = useStick()
  return (
    <Link {...stick} href={href} prefetch className="wght-link caption inline-flex items-center gap-2">
      <span aria-hidden>←</span>
      {label}
    </Link>
  )
}
