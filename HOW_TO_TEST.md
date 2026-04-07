# How to Test HeartSafe AI with Sample Files

## Quick Start

### 1. Ensure Servers Are Running
The backend and frontend must be running:
- **Backend**: http://localhost:8000 (FastAPI)
- **Frontend**: http://localhost:5173 (React)

### 2. Test via API (Command Line)

Test a single file:
```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@test_cases/test_01_normal.json"
```

Test all 10 files:
```bash
for file in test_cases/test_*.json; do
  echo "Testing: $file"
  curl -s -X POST http://localhost:8000/predict -F "file=@$file" | python3 -m json.tool
  echo ""
done
```

### 3. Test via Web Interface

1. Open http://localhost:5173 in your browser
2. Click "Upload ECG File"
3. Select any test file from `test_cases/` folder
4. View the analysis results

---

## Test Files Available

### 10 Diverse Test Cases

| File | Purpose | Signal Type |
|------|---------|-------------|
| test_01_normal.json | Baseline healthy rhythm | Standard amplitude |
| test_02_supraventricular.json | Supraventricular beat | Elevated amplitude |
| test_03_ventricular.json | Ventricular beat | High amplitude |
| test_04_fusion.json | Fusion beat | Mixed pattern |
| test_05_unclassifiable.json | Noise/unclassifiable | Extreme amplitude |
| test_06_high_bpm.json | Tachycardia (fast heart) | Closely spaced peaks |
| test_07_low_bpm.json | Bradycardia (slow heart) | Widely spaced peaks |
| test_08_ischemia.json | Ischemia risk | ST elevation |
| test_09_irregular.json | Irregular rhythm | Variable pattern |
| test_10_complex.json | Complex signal | Multiple patterns |

---

## Understanding the Output

### Response Fields

```json
{
  "diagnosis": "Normal Sinus Rhythm",
  "arrhythmia_class": "N",
  "severity": "Normal",
  "confidence": 1.0,
  "bpm": 220,
  "qrs_interval_ms": 40.0,
  "ischemia_risk": 1.0,
  "ischemia_flag": true,
  "signal_data": [...],
  "all_probabilities": {
    "N": 1.0,
    "S": 0.0,
    "V": 0.0,
    "F": 0.0,
    "Q": 0.0
  },
  "xai_weights": [...],
  "risk_assessment": "...",
  "clinical_verdict": "...",
  "precautions": [...],
  "final_report": "..."
}
```

### Key Metrics

**Arrhythmia Classes:**
- `N` = Normal Sinus Rhythm
- `S` = Supraventricular Premature Beat
- `V` = Ventricular Premature Beat
- `F` = Fusion Beat
- `Q` = Unclassifiable Beat

**Confidence:** 0.0 to 1.0 (higher = more certain)

**BPM:** Beats per minute
- Normal: 60-100
- Tachycardia: > 100
- Bradycardia: < 60

**QRS Interval:** Duration in milliseconds
- Normal: 80-120 ms

**Ischemia Risk:** 0.0 to 1.0
- 0.0 = No risk
- 1.0 = High risk

---

## Batch Testing Script

Create a file `test_all.sh`:

```bash
#!/bin/bash

echo "HeartSafe AI - Batch Test"
echo "=========================="
echo ""

for file in test_cases/test_*.json; do
    filename=$(basename "$file")
    echo "Testing: $filename"
    
    response=$(curl -s -X POST http://localhost:8000/predict -F "file=@$file")
    
    # Extract key metrics
    class=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['arrhythmia_class'])")
    diagnosis=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['diagnosis'])")
    confidence=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['confidence'])")
    bpm=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['bpm'])")
    ischemia=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['ischemia_risk'])")
    
    echo "  Class: $class | Diagnosis: $diagnosis"
    echo "  Confidence: $confidence | BPM: $bpm | Ischemia: $ischemia"
    echo ""
done

echo "=========================="
echo "All tests completed!"
```

Run it:
```bash
chmod +x test_all.sh
./test_all.sh
```

---

## File Format

Each test file is a JSON file with exactly 186 ECG values:

```json
{
  "signal": [0.0, 0.1, 0.2, ..., 0.0]
}
```

**Requirements:**
- Exactly 186 values (MIT-BIH standard)
- Floating-point numbers
- Represents ECG amplitude in millivolts (mV)

---

## Creating Custom Test Files

To create your own test file:

```python
import json

# Create 186 ECG values
signal = [0.0, 0.1, 0.2, 0.3, ...]  # Your ECG data

# Save as JSON
with open("test_cases/test_custom.json", "w") as f:
    json.dump({"signal": signal}, f)
```

Then test it:
```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@test_cases/test_custom.json"
```

---

## Troubleshooting

### "Connection refused"
- Ensure backend is running on port 8000
- Check: `curl http://localhost:8000/health`

### "File too short"
- Test files must have exactly 186 values
- Check file with: `python3 -c "import json; print(len(json.load(open('file.json'))['signal']))"`

### "Failed to parse file"
- Ensure JSON is valid
- Check format: `python3 -m json.tool test_cases/test_01_normal.json`

### "Model not loaded"
- Ensure `model/heart_model.pt` exists
- Check: `ls -lh model/heart_model.pt`

---

## Performance Notes

- Each test takes ~100-200ms
- All 10 tests complete in ~1-2 seconds
- System handles concurrent requests
- No file size limitations for 186-value signals

---

## Next Steps

1. **For Presentation**: Use the 10 test files to demonstrate system capabilities
2. **For Validation**: Compare results with expected outputs in TEST_RESULTS.md
3. **For Development**: Create additional test files for edge cases
4. **For Deployment**: Use test files for regression testing

---

## Support

For issues or questions:
1. Check TEST_RESULTS.md for expected outputs
2. Review TEST_FILES_SUMMARY.md for file descriptions
3. Check backend logs: `tail -f backend.log`
4. Verify model file: `ls -lh model/heart_model.pt`
