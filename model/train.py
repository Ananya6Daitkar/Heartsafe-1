"""
HeartSafe AI — Phase 0 & 1
MIT-BIH Arrhythmia Detection: Data Preprocessing + 1D CNN Training
Classes: N=0, S=1, V=2, F=3, Q=4
"""

import os
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
from collections import Counter
import time

# ─── Paths ────────────────────────────────────────────────────────────────────
TRAIN_CSV = os.path.join(os.path.dirname(__file__), "..", "mitbih_train.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "heart_model.pt")

# ─── Config ───────────────────────────────────────────────────────────────────
BATCH_SIZE  = 256
EPOCHS      = 15
LR          = 1e-3
DEVICE      = torch.device("cuda" if torch.cuda.is_available() else "cpu")
NUM_CLASSES = 5
CLASS_NAMES = ["N", "S", "V", "F", "Q"]

print(f"[INFO] Using device: {DEVICE}")

# ─── Phase 0: Load & Preprocess ───────────────────────────────────────────────
print("[INFO] Loading mitbih_train.csv ...")
df = pd.read_csv(TRAIN_CSV, header=None)
print(f"[INFO] Shape: {df.shape}")

X = df.iloc[:, :-1].values.astype(np.float32)   # 186 features
y = df.iloc[:, -1].values.astype(int)            # labels 0–4

print(f"[INFO] Original class distribution: {Counter(y)}")

# ─── SMOTE Oversampling ───────────────────────────────────────────────────────
print("[INFO] Applying SMOTE to balance classes ...")
smote = SMOTE(random_state=42, k_neighbors=5)
X_res, y_res = smote.fit_resample(X, y)
print(f"[INFO] Resampled class distribution: {Counter(y_res)}")

# ─── Reshape for 1D Conv: (N, channels=1, length=186) ────────────────────────
X_tensor = torch.tensor(X_res, dtype=torch.float32).unsqueeze(1)
y_tensor  = torch.tensor(y_res, dtype=torch.long)

dataset    = TensorDataset(X_tensor, y_tensor)
loader     = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)

print(f"[INFO] Training samples after SMOTE: {len(dataset)}")

# ─── Phase 1: 1D CNN Architecture ─────────────────────────────────────────────
class HeartCNN(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()

        self.conv_block1 = nn.Sequential(
            nn.Conv1d(1,  32, kernel_size=5, padding=2),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.MaxPool1d(kernel_size=2),          # 186 → 93
            nn.Dropout(0.2),
        )
        self.conv_block2 = nn.Sequential(
            nn.Conv1d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.MaxPool1d(kernel_size=2),          # 93 → 46
            nn.Dropout(0.2),
        )
        self.conv_block3 = nn.Sequential(
            nn.Conv1d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.AdaptiveAvgPool1d(1),              # 46 → 1
            nn.Dropout(0.5),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes),
        )

    def forward(self, x):
        x = self.conv_block1(x)
        x = self.conv_block2(x)
        x = self.conv_block3(x)
        return self.classifier(x)

# ─── Training Loop ────────────────────────────────────────────────────────────
model     = HeartCNN(NUM_CLASSES).to(DEVICE)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)

print(f"\n[INFO] Model parameters: {sum(p.numel() for p in model.parameters()):,}")
print(f"[INFO] Starting training for {EPOCHS} epochs ...\n")

best_acc = 0.0
for epoch in range(1, EPOCHS + 1):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    t0 = time.time()

    for X_batch, y_batch in loader:
        X_batch, y_batch = X_batch.to(DEVICE), y_batch.to(DEVICE)
        optimizer.zero_grad()
        preds = model(X_batch)
        loss  = criterion(preds, y_batch)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * X_batch.size(0)
        correct    += (preds.argmax(1) == y_batch).sum().item()
        total      += X_batch.size(0)

    scheduler.step()
    epoch_loss = total_loss / total
    epoch_acc  = correct / total * 100
    elapsed    = time.time() - t0

    print(f"  Epoch [{epoch:02d}/{EPOCHS}]  "
          f"Loss: {epoch_loss:.4f}  Acc: {epoch_acc:.2f}%  "
          f"Time: {elapsed:.1f}s")

    if epoch_acc > best_acc:
        best_acc = epoch_acc
        torch.save({
            "epoch"      : epoch,
            "model_state": model.state_dict(),
            "class_names": CLASS_NAMES,
            "accuracy"   : epoch_acc,
        }, MODEL_PATH)
        print(f"  ✓ Saved best model (acc={epoch_acc:.2f}%)")

print(f"\n[DONE] Best accuracy: {best_acc:.2f}%")
print(f"[DONE] Model saved to: {MODEL_PATH}")
