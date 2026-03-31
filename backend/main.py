"""
HeartSafe AI — Phase 2
FastAPI Backend: ECG Upload, Signal Analysis, Arrhythmia Classification
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import io
import json
from scipy.signal import find_peaks
from typing import Optional, List
import os

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(title="HeartSafe AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Model Definition (must match train.py) ───────────────────────────────────
class HeartCNN(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()
        self.conv_block1 = nn.Sequential(
            nn.Conv1d(1,  32, kernel_size=5, padding=2),
            nn.BatchNorm1d(32), nn.ReLU(),
            nn.MaxPool1d(2), nn.Dropout(0.2),
        )
        self.conv_block2 = nn.Sequential(
            nn.Conv1d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm1d(64), nn.ReLU(),
            nn.MaxPool1d(2), nn.Dropout(0.2),
        )
        self.conv_block3 = nn.Sequential(
            nn.Conv1d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm1d(128), nn.ReLU(),
            nn.AdaptiveAvgPool1d(1), nn.Dropout(0.5),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128, 64), nn.ReLU(),
            nn.Dropout(0.3), nn.Linear(64, num_classes),
        )

    def forward(self, x):
        x = self.conv_block1(x)
        x = self.conv_block2(x)
        x = self.conv_block3(x)
        return self.classifier(x)

# ─── Class Metadata ───────────────────────────────────────────────────────────
CLASS_NAMES = ["N", "S", "V", "F", "Q"]
CLASS_LABELS = {
    "N": "Normal Sinus Rhythm",
    "S": "Supraventricular Premature Beat",
    "V": "Ventricular Premature Beat",
    "F": "Fusion Beat",
    "Q": "Unclassifiable Beat",
}
SEVERITY = {"N": "Normal", "S": "Mild", "V": "Moderate", "F": "Moderate", "Q": "Unknown"}

# ─── Load Model ───────────────────────────────────────────────────────────────
DEVICE     = torch.device("cpu")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "heart_model.pt")

model = HeartCNN(num_classes=5).to(DEVICE)

if os.path.exists(MODEL_PATH):
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(checkpoint["model_state"])
    model.eval()
    print(f"[INFO] Model loaded from {MODEL_PATH}")
else:
    print(f"[WARN] Model not found at {MODEL_PATH}. Run model/train.py first.")
    model = None

# ─── Response Schema ──────────────────────────────────────────────────────────
class PredictionResponse(BaseModel):
    diagnosis: str
    arrhythmia_class: str
    severity: str
    confidence: float
    bpm: int
    qrs_interval_ms: float
    ischemia_risk: float
    ischemia_flag: bool
    signal_data: List[float]
    all_probabilities: dict
    xai_weights: List[float]
    risk_assessment: str
    clinical_verdict: str
    precautions: List[str]
    final_report: str

# ─── Signal Analysis Utilities ─────────────────────────────────────────────────
SAMPLING_RATE = 360  # Hz (MIT-BIH standard)
SIGNAL_LENGTH = 186  # features per beat

def estimate_bpm(signal: np.ndarray) -> int:
    """Detect R-peaks and estimate BPM from a single ECG beat segment."""
    norm = (signal - signal.min()) / (signal.max() - signal.min() + 1e-8)
    peaks, props = find_peaks(norm, height=0.5, distance=10)
    if len(peaks) < 1:
        # Fallback: find the single dominant peak
        peak_idx = np.argmax(norm)
        # Single beat segment -> estimate based on RR interval assumption
        # At 360 Hz, 186 samples ≈ 0.517 seconds per beat → BPM ≈ 116
        # Use peak position to refine
        rr_samples = SIGNAL_LENGTH
        bpm = int((SAMPLING_RATE / rr_samples) * 60)
    else:
        # Multiple peaks found: average RR interval
        if len(peaks) >= 2:
            rr_intervals = np.diff(peaks)
            avg_rr = np.mean(rr_intervals)
        else:
            avg_rr = SIGNAL_LENGTH
        bpm = int((SAMPLING_RATE / avg_rr) * 60)
    return max(35, min(220, bpm))

def estimate_qrs_interval(signal: np.ndarray) -> float:
    """Estimate QRS complex width in milliseconds."""
    norm = (signal - signal.min()) / (signal.max() - signal.min() + 1e-8)
    r_peak_idx = np.argmax(norm)
    threshold  = 0.5

    # Walk left from R-peak to find Q point
    q_idx = r_peak_idx
    for i in range(r_peak_idx, 0, -1):
        if norm[i] < threshold:
            q_idx = i
            break

    # Walk right from R-peak to find S point
    s_idx = r_peak_idx
    for i in range(r_peak_idx, len(norm)):
        if norm[i] < threshold:
            s_idx = i
            break

    qrs_samples = s_idx - q_idx
    qrs_ms = (qrs_samples / SAMPLING_RATE) * 1000
    return round(max(40.0, min(200.0, qrs_ms)), 1)

def analyze_st_segment(signal: np.ndarray) -> tuple[float, bool]:
    """
    Analyze the ST segment (approx indices 140–165 in normalized beat).
    Returns (ischemia_risk 0.0–1.0, ischemia_flag bool).
    ST elevation > 0.1 mV or depression < -0.1 mV indicates risk.
    """
    # Isoelectric baseline: average of first 20 samples (P-Q segment)
    baseline   = np.mean(signal[:20])
    st_segment = signal[140:165]
    st_mean    = np.mean(st_segment)
    deviation  = st_mean - baseline

    # Normalize to 0–1 risk score (deviation ±0.3 → risk 0–1)
    risk = float(np.clip(abs(deviation) / 0.3, 0.0, 1.0))
    flag = abs(deviation) > 0.08

    return round(risk, 3), flag

def compute_xai_weights(signal: np.ndarray, model: nn.Module) -> List[float]:
    """
    Approximated saliency: gradient of predicted class score w.r.t. input.
    Returns per-sample importance weights (same length as signal).
    """
    if model is None:
        return [0.0] * len(signal)
    x = torch.tensor(signal, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
    x.requires_grad_(True)
    out    = model(x)
    pred   = out.argmax(1)
    score  = out[0, pred]
    score.backward()
    saliency = x.grad.abs().squeeze().detach().numpy()
    # Normalize to 0–1
    mn, mx = saliency.min(), saliency.max()
    if mx - mn > 1e-8:
        saliency = (saliency - mn) / (mx - mn)
    return [round(float(v), 4) for v in saliency]

def generate_ai_insights(pred_class: str, confidence: float, bpm: int, qrs_ms: float, 
                         ischemia_risk: float, ischemia_flag: bool) -> tuple[str, str, List[str], str]:
    """
    Generate AI-based clinical insights and recommendations.
    Returns: (risk_assessment, clinical_verdict, precautions, final_report)
    """
    
    # Risk Assessment
    risk_score = 0
    if pred_class in ["V", "F"]:
        risk_score += 40
    elif pred_class == "S":
        risk_score += 20
    
    if ischemia_risk > 0.7:
        risk_score += 30
    elif ischemia_risk > 0.4:
        risk_score += 15
    
    if bpm < 50 or bpm > 120:
        risk_score += 15
    
    if qrs_ms > 120:
        risk_score += 10
    
    if ischemia_flag:
        risk_score += 20
    
    # Determine risk level
    if risk_score >= 70:
        risk_level = "HIGH RISK"
        risk_color = "🔴"
    elif risk_score >= 40:
        risk_level = "MODERATE RISK"
        risk_color = "🟡"
    else:
        risk_level = "LOW RISK"
        risk_color = "🟢"
    
    risk_assessment = f"{risk_color} {risk_level} (Score: {risk_score}/100)"
    
    # Clinical Verdict
    verdict_parts = []
    
    if pred_class == "N":
        verdict_parts.append("Normal sinus rhythm detected with no significant arrhythmias.")
    elif pred_class == "S":
        verdict_parts.append("Supraventricular premature beat detected. Generally benign but requires monitoring.")
    elif pred_class == "V":
        verdict_parts.append("Ventricular premature beat detected. Requires immediate clinical attention.")
    elif pred_class == "F":
        verdict_parts.append("Fusion beat detected. Indicates abnormal conduction pathway.")
    elif pred_class == "Q":
        verdict_parts.append("Unclassifiable beat detected. Recommend repeat ECG analysis.")
    
    if ischemia_flag:
        verdict_parts.append("ST-segment deviation detected indicating possible myocardial ischemia.")
    
    if ischemia_risk > 0.7:
        verdict_parts.append("High ischemia risk detected. Urgent cardiology consultation recommended.")
    
    if bpm < 50:
        verdict_parts.append("Bradycardia detected (BPM < 50). Monitor for hemodynamic stability.")
    elif bpm > 120:
        verdict_parts.append("Tachycardia detected (BPM > 120). Assess for underlying causes.")
    
    if qrs_ms > 120:
        verdict_parts.append("Prolonged QRS interval detected. May indicate ventricular conduction delay.")
    
    clinical_verdict = " ".join(verdict_parts)
    
    # Precautions
    precautions = []
    
    if pred_class in ["V", "F"]:
        precautions.append("Immediate cardiology consultation required")
        precautions.append("Consider continuous cardiac monitoring")
        precautions.append("Prepare for potential intervention")
    
    if ischemia_flag or ischemia_risk > 0.6:
        precautions.append("Assess for acute coronary syndrome")
        precautions.append("Obtain troponin levels and serial ECGs")
        precautions.append("Consider stress testing if stable")
        precautions.append("Initiate antiplatelet therapy if indicated")
    
    if bpm < 50:
        precautions.append("Monitor vital signs closely")
        precautions.append("Assess for symptoms of hypoperfusion")
        precautions.append("Have pacing capability available")
    elif bpm > 120:
        precautions.append("Identify and treat underlying cause")
        precautions.append("Consider rate control medication")
        precautions.append("Monitor for hemodynamic compromise")
    
    if qrs_ms > 120:
        precautions.append("Evaluate for bundle branch block")
        precautions.append("Consider electrolyte assessment")
    
    if pred_class == "N" and ischemia_risk < 0.3 and bpm >= 50 and bpm <= 120:
        precautions.append("Continue routine cardiac monitoring")
        precautions.append("Maintain healthy lifestyle")
        precautions.append("Regular follow-up ECGs as per protocol")
    
    # Final Report
    final_report = f"""
╔════════════════════════════════════════════════════════════════╗
║                    CARDIAC ANALYSIS REPORT                     ║
║                      AI-Generated Verdict                      ║
╚════════════════════════════════════════════════════════════════╝

PATIENT RISK ASSESSMENT: {risk_assessment}

DIAGNOSIS: {CLASS_LABELS.get(pred_class, 'Unknown')}
Confidence: {round(confidence * 100, 1)}%
Severity: {SEVERITY.get(pred_class, 'Unknown')}

VITAL PARAMETERS:
• Heart Rate: {bpm} bpm
• QRS Interval: {qrs_ms} ms
• Ischemia Risk: {round(ischemia_risk * 100, 1)}%
• ST-Segment Status: {'ABNORMAL' if ischemia_flag else 'NORMAL'}

CLINICAL VERDICT:
{clinical_verdict}

RECOMMENDED PRECAUTIONS:
"""
    for i, precaution in enumerate(precautions, 1):
        final_report += f"{i}. {precaution}\n"
    
    final_report += f"""
CONFIDENCE LEVEL: {round(confidence * 100, 1)}%
ANALYSIS TIMESTAMP: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}

⚠️  DISCLAIMER: This is an AI-assisted analysis for clinical support only.
    Final diagnosis must be confirmed by a qualified cardiologist.
    Do not use as sole basis for clinical decision-making.

╚════════════════════════════════════════════════════════════════╝
"""
    
    return risk_assessment, clinical_verdict, precautions, final_report

# ─── Predict from Signal Array ─────────────────────────────────────────────────
def predict_signal(signal: np.ndarray) -> PredictionResponse:
    if len(signal) < 186:
        raise HTTPException(400, f"Signal too short: expected 186 features, got {len(signal)}")
    
    # Use first 186 features
    sig = signal[:186].astype(np.float32)

    # Classification
    if model is None:
        raise HTTPException(503, "Model not loaded. Run model/train.py first.")
    
    x     = torch.tensor(sig).unsqueeze(0).unsqueeze(0)
    with torch.no_grad():
        logits = model(x)
        probs  = torch.softmax(logits, dim=1).squeeze().numpy()

    pred_idx   = int(probs.argmax())
    pred_class = CLASS_NAMES[pred_idx]
    confidence = float(probs[pred_idx])

    # Signal analysis
    bpm          = estimate_bpm(sig)
    qrs_ms       = estimate_qrs_interval(sig)
    risk, flag   = analyze_st_segment(sig)
    xai_weights  = compute_xai_weights(sig, model)
    
    # Generate AI insights
    risk_assessment, clinical_verdict, precautions, final_report = generate_ai_insights(
        pred_class, confidence, bpm, qrs_ms, risk, flag
    )

    return PredictionResponse(
        diagnosis        = CLASS_LABELS[pred_class],
        arrhythmia_class = pred_class,
        severity         = SEVERITY[pred_class],
        confidence       = round(confidence, 4),
        bpm              = bpm,
        qrs_interval_ms  = qrs_ms,
        ischemia_risk    = risk,
        ischemia_flag    = flag,
        signal_data      = [round(float(v), 4) for v in sig],
        all_probabilities= {CLASS_NAMES[i]: round(float(probs[i]), 4) for i in range(5)},
        xai_weights      = xai_weights,
        risk_assessment  = risk_assessment,
        clinical_verdict = clinical_verdict,
        precautions      = precautions,
        final_report     = final_report,
    )

# ─── API Endpoints ────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {
        "status"      : "online",
        "model_loaded": model is not None,
        "api"         : "HeartSafe AI v1.0",
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Upload a CSV or JSON file containing one or more ECG beats (186 values each).
    Returns classification, BPM, QRS interval, and ischemia risk for the first beat.
    """
    content = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".json"):
            data   = json.loads(content)
            # Accept {"signal": [...]} or flat list
            signal = data.get("signal", data) if isinstance(data, dict) else data
            signal = np.array(signal, dtype=np.float32).flatten()

        elif filename.endswith(".csv"):
            text = content.decode("utf-8")
            df   = pd.read_csv(io.StringIO(text), header=None)
            # Take first row; if last col is label (integer), drop it
            row  = df.iloc[0].values
            if row[-1] in [0, 1, 2, 3, 4] and len(row) == 187:
                row = row[:-1]
            signal = row.astype(np.float32)

        else:
            raise HTTPException(400, "Unsupported file type. Upload .csv or .json")

    except Exception as e:
        raise HTTPException(400, f"Failed to parse file: {str(e)}")

    return predict_signal(signal)

@app.get("/report/{analysis_id}")
def get_report(analysis_id: str):
    """Get the final clinical report for an analysis."""
    return {
        "status": "Report endpoint available",
        "message": "Report data is included in the prediction response"
    }
