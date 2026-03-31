"""
HeartSafe AI — Test Case Extractor
Extracts one representative ECG beat for each of the 5 arrhythmia classes
from mitbih_test.csv and saves them as individual uploadable CSV files.

Classes: 0=N (Normal), 1=S (Supraventricular), 2=V (Ventricular), 3=F (Fusion), 4=Q (Unknown)
"""

import pandas as pd
import numpy as np
import os
import urllib.request
import sys

# ── Paths ─────────────────────────────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(PROJECT_ROOT, "mitbih_test.csv")
OUT_DIR = os.path.join(PROJECT_ROOT, "test_cases")
os.makedirs(OUT_DIR, exist_ok=True)

# ── Download MIT-BIH if not present ────────────────────────────────────────────
if not os.path.exists(CSV_PATH):
    print(f"[INFO] Downloading MIT-BIH dataset...")
    print(f"[INFO] This may take a minute...")
    try:
        url = "https://physionet.org/files/mitdb/1.0.0/mitbih_test.csv"
        urllib.request.urlretrieve(url, CSV_PATH)
        print(f"[INFO] ✅ Downloaded to {CSV_PATH}")
    except Exception as e:
        print(f"[ERROR] Failed to download: {e}")
        print(f"[INFO] Please download manually from:")
        print(f"       https://physionet.org/files/mitdb/1.0.0/mitbih_test.csv")
        print(f"[INFO] And save to: {CSV_PATH}")
        sys.exit(1)

# ── Class metadata ─────────────────────────────────────────────────────────────
CLASSES = {
    0: {"name": "N",  "label": "Normal Sinus Rhythm",          "file": "test_N_normal.csv"},
    1: {"name": "S",  "label": "Supraventricular Premature",    "file": "test_S_supraventricular.csv"},
    2: {"name": "V",  "label": "Ventricular Premature Beat",    "file": "test_V_ventricular.csv"},
    3: {"name": "F",  "label": "Fusion Beat",                   "file": "test_F_fusion.csv"},
    4: {"name": "Q",  "label": "Unclassifiable Beat",           "file": "test_Q_unknown.csv"},
}

# ── Load dataset ───────────────────────────────────────────────────────────────
print(f"[INFO] Loading {CSV_PATH} ...")
df = pd.read_csv(CSV_PATH, header=None)
print(f"[INFO] Dataset shape: {df.shape}  ({df.shape[0]:,} beats, {df.shape[1]} columns)")

labels = df.iloc[:, -1].astype(int)
print(f"\n[INFO] Class distribution in test set:")
for cls_id, meta in CLASSES.items():
    count = (labels == cls_id).sum()
    print(f"       Class {cls_id} [{meta['name']}] {meta['label']:35s} → {count:,} samples")

# ── Extract & save one per class ───────────────────────────────────────────────
print(f"\n[INFO] Extracting one sample per class ...\n")
saved = []

for cls_id, meta in CLASSES.items():
    mask  = labels == cls_id
    subset = df[mask]

    if subset.empty:
        print(f"  ⚠️  Class {cls_id} [{meta['name']}] — NOT FOUND in test set, skipping.")
        continue

    # Pick a row with high signal amplitude (more interesting visually)
    # Use the row whose max value is closest to the 75th percentile of the class
    signals  = subset.iloc[:, :-1]
    peak_vals = signals.max(axis=1)
    target   = np.percentile(peak_vals, 75)
    best_idx = (peak_vals - target).abs().idxmin()
    row = subset.loc[[best_idx]]

    # Save: only the 186 signal values (no label column)
    signal_only = row.iloc[:, :-1]
    out_path = os.path.join(OUT_DIR, meta["file"])
    signal_only.to_csv(out_path, index=False, header=False)

    # Quick stats
    sig_vals = signal_only.values.flatten()
    print(f"  ✅  Class {cls_id} [{meta['name']}] {meta['label']}")
    print(f"       File : {out_path}")
    print(f"       Row  : index {best_idx}  |  "
          f"Min={sig_vals.min():.4f}  Max={sig_vals.max():.4f}  "
          f"Mean={sig_vals.mean():.4f}")
    print()
    saved.append({"class": meta["name"], "label": meta["label"], "path": out_path})

# ── Summary ────────────────────────────────────────────────────────────────────
print("─" * 64)
print(f"[DONE] Saved {len(saved)} test files to: {OUT_DIR}")
print()
print("  Upload any of these files at http://localhost:5173")
print()
print("  Expected results:")
print("  ┌────┬──────────────────────────────────────┬──────────────────┐")
print("  │ #  │ File                                 │ Expected Class   │")
print("  ├────┼──────────────────────────────────────┼──────────────────┤")
for i, s in enumerate(saved, 1):
    print(f"  │ {i:<2} │ {s['file']:<36} │ {s['name']} — {s['label'][:14]:<14} │")
print("  └────┴──────────────────────────────────────┴──────────────────┘")
print()
print("[TIP] If the backend returns 503, the model isn't trained yet.")
print("      Run: python model/train.py")