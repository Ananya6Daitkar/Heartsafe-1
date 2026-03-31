#!/usr/bin/env python3
"""
Create synthetic MIT-BIH format test data for HeartSafe AI
Generates realistic ECG signals for each of the 5 arrhythmia classes
"""

import numpy as np
import pandas as pd
import os

print("=" * 70)
print("Creating Synthetic MIT-BIH Format Test Data")
print("=" * 70)
print()

# Create test_cases directory
test_cases_dir = "test_cases"
os.makedirs(test_cases_dir, exist_ok=True)

# Class definitions
CLASSES = {
    0: {"name": "N", "label": "Normal Sinus Rhythm", "file": "test_N_normal.csv"},
    1: {"name": "S", "label": "Supraventricular Premature", "file": "test_S_supraventricular.csv"},
    2: {"name": "V", "label": "Ventricular Premature Beat", "file": "test_V_ventricular.csv"},
    3: {"name": "F", "label": "Fusion Beat", "file": "test_F_fusion.csv"},
    4: {"name": "Q", "label": "Unclassifiable Beat", "file": "test_Q_unknown.csv"},
}

# Generate synthetic ECG signals
def generate_normal_beat():
    """Generate a normal sinus rhythm ECG beat"""
    t = np.linspace(0, 2*np.pi, 186)
    # P wave
    p_wave = 0.15 * np.exp(-((t - 0.5)**2) / 0.1)
    # QRS complex
    qrs = -0.1 * np.sin(t - 1.5) * np.exp(-((t - 1.5)**2) / 0.15)
    qrs += 0.8 * np.sin(t - 1.5) * np.exp(-((t - 1.5)**2) / 0.08)
    # T wave
    t_wave = 0.3 * np.exp(-((t - 3.5)**2) / 0.2)
    signal = p_wave + qrs + t_wave + 0.05 * np.random.randn(186)
    return signal

def generate_supraventricular_beat():
    """Generate a supraventricular premature beat"""
    signal = generate_normal_beat()
    # Modify QRS to be narrower and earlier
    signal[80:120] *= 1.3
    signal[120:140] *= 0.7
    return signal

def generate_ventricular_beat():
    """Generate a ventricular premature beat"""
    t = np.linspace(0, 2*np.pi, 186)
    # Wider QRS complex
    qrs = -0.15 * np.sin(t - 1.5) * np.exp(-((t - 1.5)**2) / 0.2)
    qrs += 1.2 * np.sin(t - 1.5) * np.exp(-((t - 1.5)**2) / 0.12)
    # Abnormal T wave
    t_wave = -0.4 * np.exp(-((t - 3.5)**2) / 0.25)
    signal = qrs + t_wave + 0.05 * np.random.randn(186)
    return signal

def generate_fusion_beat():
    """Generate a fusion beat (mix of normal and ventricular)"""
    normal = generate_normal_beat()
    ventricular = generate_ventricular_beat()
    # Blend 50/50
    signal = 0.5 * normal + 0.5 * ventricular
    return signal

def generate_unclassifiable_beat():
    """Generate an unclassifiable beat"""
    t = np.linspace(0, 2*np.pi, 186)
    # Irregular, noisy signal
    signal = 0.3 * np.sin(t) + 0.2 * np.cos(2*t) + 0.15 * np.sin(3*t)
    signal += 0.2 * np.random.randn(186)
    return signal

# Generator functions
generators = {
    0: generate_normal_beat,
    1: generate_supraventricular_beat,
    2: generate_ventricular_beat,
    3: generate_fusion_beat,
    4: generate_unclassifiable_beat,
}

# Generate and save test cases
print("Generating synthetic ECG signals...\n")

for class_id, meta in CLASSES.items():
    # Generate signal
    signal = generators[class_id]()
    
    # Normalize to realistic range (-3 to +3 mV)
    signal = (signal - signal.mean()) / (signal.std() + 1e-8)
    signal = signal * 0.8  # Scale to reasonable range
    
    # Save as CSV (186 values, no label)
    out_path = os.path.join(test_cases_dir, meta["file"])
    df = pd.DataFrame([signal])
    df.to_csv(out_path, index=False, header=False)
    
    # Print info
    print(f"✅ Class {class_id} [{meta['name']}] {meta['label']}")
    print(f"   File: {out_path}")
    print(f"   Min: {signal.min():.4f}, Max: {signal.max():.4f}, Mean: {signal.mean():.4f}")
    print()

print("=" * 70)
print(f"✅ Created {len(CLASSES)} test files in '{test_cases_dir}/' directory")
print()
print("Next steps:")
print("1. Start the backend: uvicorn backend/main:app --reload")
print("2. Start the frontend: npm run dev (in frontend/)")
print("3. Go to http://localhost:5173")
print("4. Click 'Upload' tab")
print("5. Drag any test file from test_cases/ directory")
print("6. View the analysis results")
print()
print("=" * 70)
