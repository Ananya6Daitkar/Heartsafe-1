import React, { useEffect, useRef } from 'react'

/**
 * Heartbeat waveform visualization - ECG/EKG style canvas
 */
export default function WaveformChart({ signal = [], xaiWeights = [], showXai = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !signal.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Clear canvas with dark background
    ctx.fillStyle = '#0F1419'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 0.5
    const gridSize = 20
    for (let i = 0; i < width; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Calculate plot dimensions
    const plotWidth = width - 2 * padding
    const plotHeight = height - 2 * padding
    const minVal = Math.min(...signal)
    const maxVal = Math.max(...signal)
    const range = maxVal - minVal || 1

    // Draw waveform line
    ctx.strokeStyle = '#06B6D4'
    ctx.lineWidth = 2.5
    ctx.beginPath()

    signal.forEach((value, i) => {
      const x = padding + (i / (signal.length - 1)) * plotWidth
      const normalized = (value - minVal) / range
      const y = height - padding - normalized * plotHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw XAI heatmap if enabled
    if (showXai && xaiWeights.length) {
      signal.forEach((value, i) => {
        const weight = xaiWeights[i] ?? 0
        if (weight > 0.5) {
          const x = padding + (i / (signal.length - 1)) * plotWidth
          const normalized = (value - minVal) / range
          const y = height - padding - normalized * plotHeight

          // Draw red dot with transparency based on weight
          ctx.fillStyle = `rgba(239, 68, 68, ${weight * 0.7})`
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    // Draw axis labels
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '12px Inter'
    ctx.textAlign = 'center'
    ctx.fillText('Time (samples)', width / 2, height - 10)
    
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText('Amplitude', 0, 0)
    ctx.restore()

  }, [signal, xaiWeights, showXai])

  return (
    <div style={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        style={{
          width: '100%',
          height: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          background: '#0F1419',
          display: 'block'
        }}
      />
      <div style={{ marginTop: 12, fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
        {showXai ? '🔴 Red dots show AI attention areas' : '💙 ECG Waveform Visualization'}
      </div>
    </div>
  )
}
