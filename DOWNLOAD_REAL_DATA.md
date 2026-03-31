# Download Real MIT-BIH Data

## 🎯 Quick Steps

### Option 1: Kaggle (Easiest - No Account Needed for Download)
1. Go to: https://www.kaggle.com/datasets/shayanfazeli/heartbeat
2. Click the **Download** button (top right)
3. Extract the ZIP file
4. Copy **mitbih_test.csv** to your project root directory
5. Run: `python model/testecg.py`

### Option 2: PhysioNet (Official Source)
1. Go to: https://physionet.org/content/mitdb/1.0.0/
2. Scroll to **Files** section
3. Click **mitbih_test.csv** to download
4. Save to your project root directory
5. Run: `python model/testecg.py`

### Option 3: Direct Command Line (macOS/Linux)
```bash
# Using curl
curl -L -o mitbih_test.csv "https://www.kaggle.com/api/v1/datasets/download/shayanfazeli/heartbeat"

# Or using wget
wget -O mitbih_test.csv "https://www.kaggle.com/api/v1/datasets/download/shayanfazeli/heartbeat"
```

---

## 📋 What You'll Get

**mitbih_test.csv** contains:
- 21,892 ECG heartbeats
- 187 columns (186 ECG values + 1 label)
- 5 classes: Normal (N), Supraventricular (S), Ventricular (V), Fusion (F), Unclassifiable (Q)

---

## ✅ After Download

1. **Place the file** in your project root:
   ```
   Project-Heart-main/
   ├── mitbih_test.csv  ← Put it here
   ├── backend/
   ├── frontend/
   ├── model/
   └── ...
   ```

2. **Run the extractor**:
   ```bash
   python model/testecg.py
   ```

3. **This creates 5 test files** in `test_cases/`:
   - `test_N_normal.csv` - Normal heartbeat
   - `test_S_supraventricular.csv` - Supraventricular beat
   - `test_V_ventricular.csv` - Ventricular beat
   - `test_F_fusion.csv` - Fusion beat
   - `test_Q_unknown.csv` - Unclassifiable beat

4. **Upload to HeartSafe AI**:
   - Start backend: `uvicorn backend/main:app --reload`
   - Start frontend: `npm run dev` (in frontend/)
   - Go to http://localhost:5173
   - Click "Upload" tab
   - Drag any test file
   - View results

---

## 🔗 Direct Links

- **Kaggle**: https://www.kaggle.com/datasets/shayanfazeli/heartbeat
- **PhysioNet**: https://physionet.org/content/mitdb/1.0.0/
- **GitHub (Alternative)**: https://github.com/shayanfazeli/heartbeat

---

## ❓ Troubleshooting

### "File not found" error when running testecg.py
- Make sure `mitbih_test.csv` is in the project root directory
- Check the file name is exactly: `mitbih_test.csv`

### testecg.py creates empty files
- Verify the CSV has 187 columns
- Check first row has numeric values

### Still having issues?
- Verify file location: `ls -la mitbih_test.csv`
- Check file size: Should be ~10-15 MB
- Verify it's a valid CSV: `head -1 mitbih_test.csv | wc -w`

---

**Once you have the file, run `python model/testecg.py` and you're ready to test!**
