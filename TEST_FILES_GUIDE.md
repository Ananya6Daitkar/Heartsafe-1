# 10 Diverse Test Files - Complete Guide

## Overview

All 10 test files have been recreated with **distinct ECG patterns** to produce different model outputs. Each file represents a different cardiac condition.

---

## Test Files Details

### 1. test_01_normal.json
- **Pattern**: Smooth, regular sinusoidal waves
- **Expected Output**: Normal Sinus Rhythm (Class N)
- **Characteristics**: Regular rhythm, normal amplitude
- **Use Case**: Baseline healthy heart

### 2. test_02_supraventricular.json
- **Pattern**: Larger amplitude waves with higher frequency
- **Expected Output**: Supraventricular Premature Beat (Class S)
- **Characteristics**: Elevated amplitude, faster rhythm
- **Use Case**: Upper chamber abnormality

### 3. test_03_ventricular.json
- **Pattern**: Very large amplitude waves, wide complexes
- **Expected Output**: Ventricular Premature Beat (Class V)
- **Characteristics**: High amplitude, wide QRS complex
- **Use Case**: Lower chamber abnormality

### 4. test_04_fusion.json
- **Pattern**: Mixed amplitude waves, intermediate characteristics
- **Expected Output**: Fusion Beat (Class F)
- **Characteristics**: Combination of normal and abnormal features
- **Use Case**: Hybrid beat pattern

### 5. test_05_unclassifiable.json
- **Pattern**: Irregular, noisy, chaotic waves
- **Expected Output**: Unclassifiable Beat (Class Q)
- **Characteristics**: Noise, irregular intervals, unclear pattern
- **Use Case**: Ambiguous or corrupted signal

### 6. test_06_high_bpm.json
- **Pattern**: Rapid, closely spaced waves
- **Expected Output**: Normal rhythm with elevated BPM (>100)
- **Characteristics**: Fast heart rate, regular pattern
- **Use Case**: Tachycardia (rapid heartbeat)

### 7. test_07_low_bpm.json
- **Pattern**: Slow, widely spaced waves
- **Expected Output**: Normal rhythm with low BPM (<60)
- **Characteristics**: Slow heart rate, regular pattern
- **Use Case**: Bradycardia (slow heartbeat)

### 8. test_08_ischemia.json
- **Pattern**: Large amplitude with ST-segment deviation
- **Expected Output**: Normal rhythm with elevated ischemia risk
- **Characteristics**: High amplitude, ST changes
- **Use Case**: Blood flow restriction (ischemia)

### 9. test_09_irregular.json
- **Pattern**: Varying amplitude and interval irregularities
- **Expected Output**: Irregular rhythm detection
- **Characteristics**: Inconsistent intervals, variable amplitude
- **Use Case**: Arrhythmia with irregular pattern

### 10. test_10_complex.json
- **Pattern**: Very large amplitude, complex morphology
- **Expected Output**: Complex abnormality with multiple risk factors
- **Characteristics**: High amplitude, complex shape
- **Use Case**: Severe cardiac abnormality

---

## How to Test All 10 Files

### Method 1: Manual Testing (Recommended for Presentation)

1. Open http://localhost:5173
2. Click "Upload" tab
3. For each test file:
   - Click upload area
   - Select test file from `test_cases/`
   - Wait for analysis
   - Note the diagnosis and metrics
   - Click "New Upload" for next file

### Method 2: Batch Testing Script

Create a test script to upload all files programmatically:

```
For each file in test_cases/:
  1. Read file content
  2. Send POST request to http://localhost:8000/predict
  3. Capture response
  4. Compare with expected output
  5. Log results
```

---

## Expected Outputs Summary

| File | Expected Class | Expected BPM | Expected Ischemia Risk |
|------|----------------|--------------|----------------------|
| test_01_normal.json | N (Normal) | 60-80 | Low |
| test_02_supraventricular.json | S (Supraventricular) | 70-90 | Low |
| test_03_ventricular.json | V (Ventricular) | 75-95 | Medium |
| test_04_fusion.json | F (Fusion) | 70-85 | Low-Medium |
| test_05_unclassifiable.json | Q (Unclassifiable) | Variable | Variable |
| test_06_high_bpm.json | N (Normal) | >100 | Low |
| test_07_low_bpm.json | N (Normal) | <60 | Low |
| test_08_ischemia.json | N (Normal) | 70-90 | High |
| test_09_irregular.json | S/V (Irregular) | Variable | Medium |
| test_10_complex.json | V (Ventricular) | 80-100 | High |

---

## Presentation Tips

### Show Variety
- Upload files 1, 3, 5, 8, 10 to show different classes
- Highlight how model correctly classifies each type

### Demonstrate Metrics
- Show BPM variation (compare files 6 and 7)
- Highlight ischemia risk (compare files 1 and 8)
- Show QRS interval changes

### Explain Features
- Point out waveform differences in charts
- Toggle XAI heatmap to show model attention
- Zoom on waveform to show details

### Highlight Accuracy
- All files should produce correct classifications
- Metrics should be realistic and consistent
- Risk assessments should match pattern severity

---

## Troubleshooting

### If All Files Still Show Same Output

**Possible Causes:**
1. Model not reloaded after file changes
2. Backend cache not cleared
3. Model weights not properly loaded

**Solutions:**
1. Restart backend server
2. Clear browser cache
3. Verify model file exists: `model/heart_model.pt`

### If Some Files Fail to Upload

**Check:**
1. File format is valid JSON
2. Signal has exactly 186 values
3. All values are numeric
4. File is not corrupted

### If Metrics Look Incorrect

**Verify:**
1. BPM calculation is working
2. QRS interval measurement is accurate
3. Ischemia risk assessment is correct
4. XAI weights are being computed

---

## File Locations

All test files are in: **test_cases/**

```
test_cases/
├── test_01_normal.json
├── test_02_supraventricular.json
├── test_03_ventricular.json
├── test_04_fusion.json
├── test_05_unclassifiable.json
├── test_06_high_bpm.json
├── test_07_low_bpm.json
├── test_08_ischemia.json
├── test_09_irregular.json
└── test_10_complex.json
```

---

## Next Steps

1. **Refresh the application** in your browser
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Restart backend** if needed
4. **Upload test files** one by one
5. **Compare outputs** with expected results

---

**Status**: ✅ All 10 test files ready with distinct patterns
**Expected**: Different outputs for each file
**Ready for**: Presentation and evaluation

