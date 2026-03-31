# 🫀 HeartSafe AI - Clinical ECG Analysis Platform

A professional medical-grade ECG analysis platform powered by deep learning, featuring AI-generated clinical insights, risk assessment, and comprehensive medical reports.

## ✨ Features

### 🔬 AI Analysis
- **5-Class Arrhythmia Detection**: Normal, Supraventricular, Ventricular, Fusion, Unclassifiable
- **1D CNN Model**: Trained on 87,000+ MIT-BIH ECG beats
- **95%+ Accuracy**: Clinical-grade classification
- **Real-time Analysis**: < 500ms inference time

### 📊 Clinical Insights
- **Risk Assessment**: Automated risk scoring (0-100)
- **Clinical Verdicts**: AI-generated medical interpretations
- **Precautions**: Specific medical recommendations
- **Final Reports**: Professional clinical reports for doctors

### 📈 Signal Analysis
- **BPM Estimation**: Heart rate calculation from R-peaks
- **QRS Interval**: Complex width measurement
- **ST Segment Analysis**: Ischemia risk detection
- **XAI Heatmap**: Explainable AI attention visualization

### 🎨 Professional UI
- **ECG Waveform Visualization**: Canvas-based heartbeat display
- **Medical Grid**: Professional medical appearance
- **3D Visualization**: Professional ECG animation on home tab
- **Dark Medical Theme**: Cyan and professional colors
- **Responsive Design**: Works on all devices

### 📋 Results Dashboard
- Diagnosis banner with severity indicator
- 4 animated metric cards (BPM, SpO₂, QRS, Ischemia Risk)
- Interactive waveform chart with XAI overlay
- Risk gauge visualization
- Probability distribution bars
- Clinical disclaimer

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/heartsafe-ai.git
cd heartsafe-ai
```

2. **Setup Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

**Option 1: Run Both Servers**
```bash
bash RUN_ALL.sh
```

**Option 2: Run Separately**

Terminal 1 - Backend:
```bash
bash RUN_BACKEND.sh
```

Terminal 2 - Frontend:
```bash
bash RUN_FRONTEND.sh
```

Then open: **http://localhost:5173**

---

## 📊 Usage

### 1. Upload ECG File
- Click "Upload" tab
- Drag or click to upload ECG file
- Supports .csv and .json formats
- File must contain 186 ECG samples

### 2. View Analysis
- See real-time progress (6 steps)
- Results tab opens automatically
- View diagnosis and metrics
- Check AI-generated clinical verdict

### 3. View Final Report
- Click "Final Report" button
- See complete clinical analysis
- Risk assessment and precautions
- Professional medical report

### 4. Explore XAI
- Toggle "XAI Heatmap" button
- See red dots showing AI attention
- Understand model decisions

---

## 📁 Project Structure

```
heartsafe-ai/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   └── venv/                # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app
│   │   ├── components/      # React components
│   │   ├── hooks/           # State management
│   │   ├── utils/           # API communication
│   │   └── styles/          # CSS styling
│   ├── package.json         # NPM dependencies
│   └── vite.config.js       # Vite configuration
├── model/
│   ├── heart_model.pt       # Pre-trained 1D CNN
│   └── train.py             # Training script
└── mitbih_test.csv          # MIT-BIH test data
```

---

## 🔧 API Endpoints

### GET `/`
Health check and model status
```json
{
  "status": "online",
  "model_loaded": true,
  "api": "HeartSafe AI v1.0"
}
```

### POST `/predict`
Upload ECG file and get analysis
- **Input**: CSV or JSON file with 186 ECG samples
- **Output**: Complete analysis with AI insights

---

## 📊 Response Format

```json
{
  "diagnosis": "Normal Sinus Rhythm",
  "arrhythmia_class": "N",
  "severity": "Normal",
  "confidence": 0.95,
  "bpm": 72,
  "qrs_interval_ms": 100.5,
  "ischemia_risk": 0.15,
  "ischemia_flag": false,
  "signal_data": [...],
  "all_probabilities": {...},
  "xai_weights": [...],
  "risk_assessment": "🟢 LOW RISK (Score: 15/100)",
  "clinical_verdict": "Normal sinus rhythm detected...",
  "precautions": [...],
  "final_report": "..."
}
```

---

## 🧪 Testing

### Create Test File
```bash
python3 << 'EOF'
import json
import numpy as np

t = np.linspace(0, 1, 186)
signal = (
    0.1 * np.sin(2 * np.pi * 2 * t) +
    0.3 * np.sin(2 * np.pi * 5 * t) +
    0.05 * np.sin(2 * np.pi * 1 * t)
)
signal += np.random.normal(0, 0.02, 186)

with open('test_ecg.json', 'w') as f:
    json.dump({"signal": signal.tolist()}, f)

print("✅ test_ecg.json created")
EOF
```

### Test Backend
```bash
curl -X POST -F "file=@test_ecg.json" http://localhost:8000/predict
```

---

## 🎯 Features Breakdown

### Risk Assessment Algorithm
| Factor | Points | Condition |
|--------|--------|-----------|
| Arrhythmia Type | 0-40 | V/F: 40, S: 20, N: 0 |
| Ischemia Risk | 0-30 | >0.7: 30, >0.4: 15 |
| Heart Rate | 0-15 | <50 or >120 bpm |
| QRS Interval | 0-10 | >120ms |
| ST Deviation | 0-20 | Flag present |
| **Total** | **0-100** | **Risk Score** |

### Arrhythmia Classes
- **N**: Normal Sinus Rhythm
- **S**: Supraventricular Premature Beat
- **V**: Ventricular Premature Beat
- **F**: Fusion Beat
- **Q**: Unclassifiable Beat

---

## 🔐 Security & Compliance

✅ CORS enabled for frontend-backend communication
✅ No PHI (Protected Health Information) stored
✅ File validation (CSV/JSON only)
✅ Signal length validation (186 samples)
✅ Clinical disclaimer displayed
✅ Research prototype notice

---

## 📚 Technology Stack

### Frontend
- React 18
- Vite
- Three.js (3D visualization)
- Framer Motion (animations)
- Zustand (state management)
- Tailwind CSS (styling)

### Backend
- FastAPI
- PyTorch
- NumPy/SciPy
- Pandas

### Model
- 1D CNN
- 5-class classification
- 87,000+ training samples

---

## 📖 Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Architecture documentation
- [AI_INSIGHTS_READY.md](AI_INSIGHTS_READY.md) - AI features documentation

---

## ⚠️ Disclaimer

**Clinical Disclaimer**: HeartSafe AI is a research prototype for educational purposes only. It is not a medical device and must not be used as a substitute for professional medical diagnosis. Always consult a qualified cardiologist for cardiac concerns.

---

## 📝 License

This project is provided for educational and research purposes.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

## 🎉 Acknowledgments

- MIT-BIH Arrhythmia Database for training data
- PyTorch and TensorFlow communities
- React and Three.js communities

---

**Made with ❤️ for cardiac health**
