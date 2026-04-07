# HeartSafe AI - Test Files Summary

## Overview
10 diverse ECG test files have been created to demonstrate the HeartSafe AI system's capabilities. Each file contains 186 ECG signal values representing a single heartbeat.

## Test Files

### 1. test_01_normal.json
**Description**: Normal sinus rhythm with standard amplitude and frequency
**Signal Pattern**: Smooth sinusoidal waves with moderate amplitude (0.0 to 1.0 mV)
**Expected Output**: Normal classification with standard metrics
**Use Case**: Baseline healthy heart rhythm

### 2. test_02_supraventricular.json
**Description**: Supraventricular premature beat pattern
**Signal Pattern**: Higher amplitude waves (0.0 to 2.2 mV) with increased frequency
**Expected Output**: Supraventricular classification
**Use Case**: Demonstrates early heartbeat from upper chambers

### 3. test_03_ventricular.json
**Description**: Ventricular premature beat pattern
**Signal Pattern**: Very high amplitude waves (0.0 to 3.0 mV) with distinctive shape
**Expected Output**: Ventricular classification
**Use Case**: Shows abnormal beat originating from lower chambers

### 4. test_04_fusion.json
**Description**: Fusion beat pattern (combination of normal and abnormal)
**Signal Pattern**: Mixed amplitude patterns with varying frequencies
**Expected Output**: Fusion beat classification
**Use Case**: Demonstrates hybrid beat characteristics

### 5. test_05_unclassifiable.json
**Description**: Unclassifiable/noise pattern
**Signal Pattern**: Highly irregular with extreme amplitudes (0.0 to 3.5 mV)
**Expected Output**: Unclassifiable beat
**Use Case**: Shows system's ability to identify unclear signals

### 6. test_06_high_bpm.json
**Description**: High heart rate (tachycardia) pattern
**Signal Pattern**: Closely spaced peaks indicating rapid heartbeat
**Expected Output**: Normal classification with elevated BPM
**Use Case**: Demonstrates tachycardia detection

### 7. test_07_low_bpm.json
**Description**: Low heart rate (bradycardia) pattern
**Signal Pattern**: Widely spaced peaks indicating slow heartbeat
**Expected Output**: Normal classification with low BPM
**Use Case**: Demonstrates bradycardia detection

### 8. test_08_ischemia.json
**Description**: Ischemia risk pattern (ST segment elevation)
**Signal Pattern**: Elevated baseline in middle section (indices 140-165)
**Expected Output**: Normal classification with elevated ischemia risk
**Use Case**: Shows cardiac ischemia detection

### 9. test_09_irregular.json
**Description**: Irregular rhythm pattern
**Signal Pattern**: Varying amplitude and frequency throughout
**Expected Output**: Normal classification with irregular metrics
**Use Case**: Demonstrates arrhythmia detection

### 10. test_10_complex.json
**Description**: Complex multi-pattern signal
**Signal Pattern**: Multiple amplitude levels and frequencies combined
**Expected Output**: Complex classification
**Use Case**: Demonstrates system's ability to handle complex signals

## Testing Instructions

### Via API
```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@test_cases/test_01_normal.json"
```

### Expected Response Fields
- `diagnosis`: Full diagnosis name
- `arrhythmia_class`: Single letter classification (N, S, V, F, Q)
- `confidence`: Confidence score (0.0 to 1.0)
- `bpm`: Heart rate in beats per minute
- `qrs_interval_ms`: QRS complex duration in milliseconds
- `ischemia_risk`: Ischemia risk score (0.0 to 1.0)
- `ischemia_flag`: Boolean indicating ischemia presence
- `all_probabilities`: Probability distribution across all classes

## Key Metrics Explained

### BPM (Beats Per Minute)
- Normal range: 60-100 bpm
- Tachycardia: > 100 bpm
- Bradycardia: < 60 bpm

### QRS Interval
- Normal range: 80-120 ms
- Indicates ventricular depolarization duration

### Ischemia Risk
- 0.0: No ischemia detected
- 1.0: High ischemia risk
- Based on ST segment analysis

### Confidence
- 1.0: Model is certain about classification
- 0.5: Model is uncertain
- 0.0: Model has no confidence

## File Format

Each test file is a JSON file with the following structure:
```json
{
  "signal": [value1, value2, ..., value186]
}
```

Where each value is a floating-point number representing the ECG amplitude in millivolts (mV).

## Notes

- All files contain exactly 186 ECG values (standard MIT-BIH format)
- Values are normalized to represent realistic ECG amplitudes
- Files are designed to test different aspects of the classification system
- Can be used for demonstration, evaluation, or testing purposes
