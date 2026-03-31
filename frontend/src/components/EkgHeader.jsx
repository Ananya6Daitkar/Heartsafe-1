import React from 'react'

export default function EkgHeader() {
  // Build a repeating EKG-like SVG path
  const W = 1200; const H = 56
  const mid = H / 2

  // One EKG cycle (PQRST) as relative points
  const cycle = (ox) => [
    [ox,       mid],
    [ox+40,    mid],
    [ox+50,    mid - 5],
    [ox+60,    mid + 5],
    [ox+70,    mid],        // P wave end
    [ox+90,    mid],
    [ox+95,    mid + 8],    // Q
    [ox+103,   mid - 28],   // R peak
    [ox+111,   mid + 10],   // S
    [ox+118,   mid],
    [ox+140,   mid],
    [ox+150,   mid - 6],    // T wave
    [ox+165,   mid + 2],
    [ox+175,   mid],
    [ox+240,   mid],
  ]

  const allPoints = [...cycle(0), ...cycle(240), ...cycle(480), ...cycle(720), ...cycle(960)]
  const d = allPoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')

  return (
    <div className="ekg-strip">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="ekgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)"/>
            <stop offset="15%"  stopColor="rgba(255,255,255,0.9)"/>
            <stop offset="85%"  stopColor="rgba(255,255,255,0.9)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>
        <path d={d} stroke="url(#ekgGrad)" strokeWidth="2.5" fill="none"
              strokeDasharray="2400" strokeDashoffset="2400">
          <animate attributeName="stroke-dashoffset"
                   from="2400" to="-2400"
                   dur="5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  )
}
