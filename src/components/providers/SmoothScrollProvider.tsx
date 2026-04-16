'use client';
import { ReactLenis } from '@studio-freight/react-lenis'

/**
 * Lenis: če nastaviš `duration`, knjižnica za wheel uporabi časovno animacijo namesto lerp —
 * to daje občutek zamika. Pustimo samo lerp (brez duration) + nekoliko višji lerp = bolj odzivno.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.14,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  )
}
