import React, { useState } from 'react'
import { motion } from 'framer-motion'
import EkgHeader from './EkgHeader'
import MetricCard from './MetricCard'
import WaveformChart from './WaveformChart'
import IschemiaGauge from './IschemiaGauge'
import ProbabilityBars from './ProbabilityBars'

const SEVERITY_CLASS = {
  Normal: 'normal', Mild: 'mild', Moderate: 'moderate', Unknown: 'unknown',
}

const SEVERITY_ICON = {
  Normal: '✅', Mild: '⚠️', Moderate: '🔶', Unknown: '❓',
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } },
}

export default function ResultsDashboard({ result, onReset }) {
  const [showXai, setShowXai] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const {
    diagnosis, arrhythmia_class, severity, confidence,
    bpm, qrs_interval_ms, ischemia_risk, ischemia_flag,
    signal_data, all_probabilities, xai_weights,
    risk_assessment, clinical_verdict, precautions, final_report,
  } = result

  const severityKey   = SEVERITY_CLASS[severity] ?? 'unknown'
  const severityIcon  = SEVERITY_ICON[severity]  ?? '❓'
  const confPct       = Math.round(confidence * 100)
  const spo2 = bpm < 60 ? 94 : bpm > 120 ? 96 : 98

  return (
    <motion.div
      className="dashboard"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ── Animated EKG strip ── */}
      <motion.div variants={fadeUp}>
        <EkgHeader />
      </motion.div>

      {/* ── Top bar ── */}
      <motion.div variants={fadeUp} className="dashboard-header" style={{ marginTop: 24 }}>
        <div>
          <div className="dashboard-title">Cardiac Analysis Report</div>
          <div className="dashboard-sub">
            Generated {new Date().toLocaleString()} · Model confidence {confPct}%
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className="new-upload-btn" 
            onClick={() => setShowReport(!showReport)}
            style={{ background: showReport ? '#06B6D4' : 'inherit' }}
          >
            📋 Final Report
          </button>
          <button className="new-upload-btn" onClick={onReset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            New Upload
          </button>
        </div>
      </motion.div>

      {/* ── Final Report Modal ── */}
      {showReport && (
        <motion.div variants={fadeUp} style={{
          background: '#1a1f2e',
          border: '1px solid #06B6D4',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#d1d5db',
          maxHeight: 600,
          overflowY: 'auto'
        }}>
          {final_report}
        </motion.div>
      )}

      {/* ── Risk Assessment Banner ── */}
      <motion.div variants={fadeUp} style={{
        background: risk_assessment.includes('HIGH') ? '#7f1d1d' : 
                   risk_assessment.includes('MODERATE') ? '#78350f' : '#064e3b',
        border: '2px solid ' + (risk_assessment.includes('HIGH') ? '#dc2626' : 
                               risk_assessment.includes('MODERATE') ? '#f59e0b' : '#10b981'),
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        fontSize: 18,
        fontWeight: 600,
        color: '#fff'
      }}>
        RISK ASSESSMENT: {risk_assessment}
      </motion.div>

      {/* ── Clinical Verdict ── */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid #06B6D4',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#06B6D4', marginBottom: 12 }}>
          🔬 CLINICAL VERDICT
        </div>
        <div style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.6 }}>
          {clinical_verdict}
        </div>
      </motion.div>

      {/* ── Precautions ── */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(255, 107, 107, 0.1)',
        border: '1px solid #FF6B6B',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#FF6B6B', marginBottom: 12 }}>
          ⚠️ RECOMMENDED PRECAUTIONS
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {precautions.map((precaution, idx) => (
            <li key={idx} style={{ fontSize: 13, color: '#d1d5db', marginBottom: 8, paddingLeft: 20 }}>
              <span style={{ color: '#FF6B6B', marginRight: 8 }}>•</span>
              {precaution}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Diagnosis banner ── */}
      <motion.div variants={fadeUp} className={`diagnosis-banner ${severityKey}`}>
        <div className="diagnosis-icon">{severityIcon}</div>
        <div>
          <div className="diagnosis-label">{diagnosis}</div>
          <div className="diagnosis-class">Class {arrhythmia_class} · {severity} Severity</div>
        </div>
        <div className="diagnosis-conf">
          <div className="diagnosis-conf-val">{confPct}%</div>
          <div className="diagnosis-conf-lbl">Confidence</div>
        </div>
      </motion.div>

      {/* ── Metrics grid ── */}
      <motion.div variants={fadeUp} className="metrics-grid">
        <MetricCard icon="❤️" value={bpm}            unit="bpm"  label="Heart Rate"         className="bpm" />
        <MetricCard icon="🫁" value={spo2}           unit="%"    label="Est. SpO₂"           className="spo2" />
        <MetricCard icon="⚡" value={qrs_interval_ms} unit="ms"  label="QRS Duration"        className="qrs" />
        <MetricCard icon="🩺" value={Math.round(ischemia_risk * 100)} unit="%" label="Ischemia Risk" className="ischemia" />
      </motion.div>

      {/* ── Waveform + Gauge ── */}
      <motion.div variants={fadeUp} className="chart-row">

        {/* Waveform card */}
        <div className="card">
          <div className="card-title">ECG Signal — Uploaded Beat</div>
          <div className="card-sub">186-point segment at 360 Hz sampling rate</div>

          {/* XAI toggle */}
          <div className="xai-toggle">
            <button
              id="xai-toggle-btn"
              className={`toggle-btn ${showXai ? 'active' : ''}`}
              onClick={() => setShowXai(v => !v)}
              aria-pressed={showXai}
            >
              <div className="toggle-knob" />
            </button>
            <span className="toggle-label">
              {showXai ? '🔴 XAI Heatmap ON — red = high AI attention' : 'XAI Heatmap'}
            </span>
          </div>

          <WaveformChart
            signal={signal_data}
            xaiWeights={xai_weights}
            showXai={showXai}
          />
        </div>

        {/* Gauge card */}
        <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 24 }}>
          <div style={{ width: '100%' }}>
            <div className="card-title">Blockage Risk Gauge</div>
            <div className="card-sub">Based on ST-segment deviation analysis</div>
          </div>

          <IschemiaGauge risk={ischemia_risk} />

          {ischemia_flag && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '10px 16px',
              fontSize: 13, color: '#991B1B',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ ST elevation/depression detected — consult a cardiologist.
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Probability breakdown ── */}
      <motion.div variants={fadeUp}>
        <div className="card">
          <div className="card-title">Class Probability Distribution</div>
          <div className="card-sub">Softmax output across all 5 arrhythmia categories</div>
          <ProbabilityBars probs={all_probabilities} />
        </div>
      </motion.div>

      {/* ── Footer disclaimer ── */}
      <motion.div variants={fadeUp}>
        <div style={{
          marginTop: 24, padding: '14px 20px',
          background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: 12, fontSize: 12, color: '#92400E',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span>⚠️</span>
          <span>
            <strong>Clinical Disclaimer:</strong> HeartSafe AI is a research prototype for educational purposes only.
            It is not a medical device and must not be used as a substitute for professional medical diagnosis.
            Always consult a qualified cardiologist for cardiac concerns.
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
