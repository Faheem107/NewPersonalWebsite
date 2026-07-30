'use client'

import { useEffect, useLayoutEffect } from 'react'

/**
 * useLayoutEffect, minus the SSR warning.
 *
 * Entrance animations have to set their starting state before the browser
 * paints, or the content shows at full opacity for a frame and then blanks.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
