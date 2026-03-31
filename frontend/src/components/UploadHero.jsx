import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PROGRESS_STEPS = [
  'Reading ECG signal…',
  'Running 1D CNN inference…',
  'Analyzing ST-segment…',
  'Detecting R-peaks…',
  'Generating XAI heatmap…',
  'Preparing report…',
]

export default function UploadHero({ onResult, onError }) {
  const [dragging,    setDragging]  = useState(false)
  const [analyzing,  setAnalyzing] = useState(false)
  const [progress,   setProgress]  = useState(0)
  const [stepLabel,  setStepLabel] = useState('')

  const fakeProgress = () => {
    return new Promise((resolve) => {
      let step = 0
      const interval = setInterval(() => {
        step++
        setProgress(Math.min(step * 16, 90))
        setStepLabel(PROGRESS_STEPS[Math.min(step - 1, PROGRESS_STEPS.length - 1)])
        if (step >= PROGRESS_STEPS.length) {
          clearInterval(interval)
          resolve()
        }
      }, 350)
    })
  }

  const submit = useCallback(async (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      onError('Please upload a .csv or .json file.')
      return
    }
    setAnalyzing(true)
    setProgress(0)
    setStepLabel(PROGRESS_STEPS[0])

    try {
      const [, res] = await Promise.all([
        fakeProgress(),
        (async () => {
          const formData = new FormData()
          formData.append('file', file)
          const r = await fetch('http://localhost:8000/predict', { method: 'POST', body: formData })
          if (!r.ok) {
            const err = await r.json().catch(() => ({ detail: 'Server error' }))
            throw new Error(err.detail || 'Upload failed')
          }
          return r.json()
        })(),
      ])
      setProgress(100)
      setStepLabel('Done!')
      await new Promise(r => setTimeout(r, 400))
      onResult(res)
    } catch (e) {
      setAnalyzing(false)
      setProgress(0)
      onError(e.message)
    }
  }, [onResult, onError])

  const onFileChange = (e) => submit(e.target.files?.[0])
  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    submit(e.dataTransfer.files?.[0])
  }

  return (
    <div className="upload-hero">
      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontSize: 42, fontWeight: 800, letterSpacing: '-1.5px',
          background: 'linear-gradient(135deg, #0D9488 0%, #065F46 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 10,
        }}>
          HeartSafe AI
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
          Clinical-grade arrhythmia detection powered by a 1D CNN trained on 87,000+ ECG beats.
        </p>
      </motion.div>

      {/* Upload card */}
      <motion.div
        className="upload-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 22 }}
      >
        {/* Pulsing heartbeat icon */}
        <div className="pulse-icon-wrapper">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h3l3-9 4 18 3-9h5" stroke="#0D9488" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="upload-title">Upload ECG Reading</h2>
        <p className="upload-subtitle">
          Drop a CSV row from the MIT-BIH dataset (186 values) or a JSON
          file with a <code style={{ background:'#F3F4F6', padding:'1px 5px', borderRadius:4 }}>signal</code> array
          to get your instant cardiac analysis.
        </p>

        <AnimatePresence mode="wait">
          {!analyzing ? (
            <motion.div key="dropzone"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className={`drop-zone ${dragging ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => document.getElementById('ecg-file-input').click()}
                style={{ cursor: 'pointer' }}
              >
                <input
                  id="ecg-file-input"
                  type="file"
                  accept=".csv,.json"
                  onChange={onFileChange}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: 32, marginBottom: 10 }}>
                  {dragging ? '📂' : '📁'}
                </div>
                <p className="drop-zone-text">
                  <strong>Click to browse</strong> or drag your file here
                </p>
                <p className="upload-formats">Accepted: .csv · .json</p>
              </div>

              {/* Sample-data download hint */}
              <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-light)' }}>
                💡 No file? Use any row from <code>mitbih_test.csv</code> saved as a single-row CSV.
              </p>
            </motion.div>
          ) : (
            <motion.div key="progress"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="progress-wrap">
                <div className="progress-label">
                  <span className="spinner" />
                  {stepLabel}
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-light)', textAlign: 'right' }}>
                  {progress}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {['5-Class Arrhythmia Detection','BPM Estimation','ST Ischemia Analysis','XAI Heatmap','No PHI Required'].map(f => (
          <span key={f} style={{
            fontSize: 12, fontWeight: 500, padding: '6px 14px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 20, color: 'var(--text-muted)', boxShadow: 'var(--shadow-sm)',
          }}>{f}</span>
        ))}
      </motion.div>
    </div>
  )
}
