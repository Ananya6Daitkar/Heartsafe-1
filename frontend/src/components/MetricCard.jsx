import React, { useEffect, useRef } from 'react'

/**
 * Animated count-up from 0 to target over ~1.2s
 */
export default function MetricCard({ icon, value, unit, label, className }) {
  const elRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el || typeof value !== 'number') { if (el) el.textContent = value; return }

    const duration = 1200
    const start    = performance.now()
    const from     = 0
    const to       = value

    const tick = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      el.textContent = (from + (to - from) * ease).toFixed(
        Number.isInteger(to) ? 0 : 1
      )
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value])

  return (
    <div className={`metric-card ${className}`}>
      <span className="metric-icon">{icon}</span>
      <div className="metric-value">
        <span ref={elRef}>{typeof value === 'number' ? 0 : value}</span>
        <span className="metric-unit">{unit}</span>
      </div>
      <div className="metric-label">{label}</div>
    </div>
  )
}
