import { useCallback, useRef } from 'react'

const SWIPE_THRESHOLD = 50
const MOBILE_MAX_WIDTH = 1024

/**
 * Hook for horizontal swipe gestures on mobile.
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Called when user swipes left (next)
 * @param {Function} options.onSwipeRight - Called when user swipes right (prev)
 * @param {boolean} [options.mobileOnly=true] - Only enable on mobile viewport
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, mobileOnly = true }) {
  const touchStart = useRef({ x: 0, y: 0 })
  const touchEnd = useRef({ x: 0, y: 0 })

  const isMobile = useCallback(() => {
    if (!mobileOnly) return true
    return typeof window !== 'undefined' && window.innerWidth < MOBILE_MAX_WIDTH
  }, [mobileOnly])

  const handleTouchStart = useCallback(
    (e) => {
      if (!isMobile()) return
      const t = e.touches?.[0] ?? e
      touchStart.current = { x: t.clientX, y: t.clientY }
    },
    [isMobile]
  )

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isMobile()) return
      const t = e.changedTouches?.[0] ?? e
      touchEnd.current = { x: t.clientX, y: t.clientY }
      const dx = touchStart.current.x - touchEnd.current.x
      const dy = touchStart.current.y - touchEnd.current.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx > 0) onSwipeLeft?.()
        else onSwipeRight?.()
      }
    },
    [isMobile, onSwipeLeft, onSwipeRight]
  )

  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
}
