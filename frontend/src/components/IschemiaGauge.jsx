import React, { useMemo } from 'react'

/**
 * SVG Radial Needle Gauge for Ischemia Risk
 * risk: 0.0 – 1.0
 */
export default function IschemiaGauge({ risk = 0 }) {
  const pct    = Math.max(0, Math.min(1, risk))
  const angle  = -150 + pct * 300   // arc: -150° to +150°
  const rad    = (angle * Math.PI) / 180
  const cx     = 120; const cy = 120; const r = 90

  // Needle endpoint
  const nx = cx + (r - 16) * Math.cos(rad)
  const ny = cy + (r - 16) * Math.sin(rad)

  // Determine status color
  const status = pct < 0.35 ? 'low' : pct < 0.65 ? 'moderate' : 'high'
  const statusLabel = pct < 0.35 ? 'Low Risk' : pct < 0.65 ? 'Moderate' : 'High Risk'

  // Arc segments (background gradient bands)
  const arcSegments = useMemo(() => {
    const segs = []
    const colors = ['#10B981','#34D399','#FCD34D','#F59E0B','#EF4444']
    for (let i = 0; i < 5; i++) {
      const startAngle = -150 + i * 60
      const endAngle   = startAngle + 60
      const s = (startAngle * Math.PI) / 180
      const e = (endAngle * Math.PI) / 180
      const x1 = cx + r * Math.cos(s); const y1 = cy + r * Math.sin(s)
      const x2 = cx + r * Math.cos(e); const y2 = cy + r * Math.sin(e)
      segs.push({ x1, y1, x2, y2, color: colors[i], startAngle, endAngle })
    }
    return segs
  }, [])

  return (
    <div className="gauge-wrap">
      <svg className="gauge-svg" viewBox="30 40 180 110">
        {/* Arc track */}
        {arcSegments.map((seg, i) => {
          const sr = (seg.startAngle * Math.PI) / 180
          const er = (seg.endAngle   * Math.PI) / 180
          const x1 = cx + r * Math.cos(sr); const y1 = cy + r * Math.sin(sr)
          const x2 = cx + r * Math.cos(er); const y2 = cy + r * Math.sin(er)
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              stroke={seg.color}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          )
        })}

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke="#1F2937"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6" fill="#1F2937" />
        <circle cx={cx} cy={cy} r="3" fill="white" />

        {/* Labels */}
        <text x="42" y={cy + 22} fontSize="9" fill="#9CA3AF">Low</text>
        <text x="180" y={cy + 22} fontSize="9" fill="#9CA3AF">High</text>
      </svg>

      <div className="gauge-value">{Math.round(pct * 100)}%</div>
      <div className={`gauge-status ${status}`}>{statusLabel}</div>
      <div className="gauge-label">ST-Segment Ischemia Risk</div>
    </div>
  )
}
