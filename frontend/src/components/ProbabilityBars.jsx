import React from 'react'

const CLASS_NAMES = ['N', 'S', 'V', 'F', 'Q']
const CLASS_FULL  = {
  N: 'Normal',
  S: 'Supraventricular',
  V: 'Ventricular',
  F: 'Fusion Beat',
  Q: 'Unclassifiable',
}

export default function ProbabilityBars({ probs = {} }) {
  return (
    <div style={{ marginTop: 4 }}>
      {CLASS_NAMES.map(cls => {
        const p = (probs[cls] ?? 0) * 100
        return (
          <div key={cls} className="proba-row">
            <span className="proba-class">{cls}</span>
            <div className="proba-track">
              <div className="proba-fill" style={{ width: `${p.toFixed(1)}%` }} />
            </div>
            <span className="proba-pct">{p.toFixed(1)}%</span>
          </div>
        )
      })}
      <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>
        N=Normal · S=Supra · V=Ventricular · F=Fusion · Q=Unknown
      </div>
    </div>
  )
}
