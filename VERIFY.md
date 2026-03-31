# HeartSafe AI - Complete Verification Checklist

## Quick Verification Commands

Run these commands to verify everything is in place:

### 1. Check Project Structure

```bash
# Verify all required directories exist
ls -la backend/
ls -la frontend/
ls -la model/

# Expected output:
# backend/: main.py, requirements.txt
# frontend/: src/, package.json, vite.config.js
# model/: train.py, heart_model.pt, testecg.py
```

### 2. Check Backend Files

```bash
# Verify backend files
ls -la backend/main.py
ls -la backend/requirements.txt

# Expected: Both files should exist
```

### 3. Check Frontend Files

```bash
# Verify frontend structure
ls -la frontend/src/
ls -la frontend/src/components/
ls -la frontend/src/hooks/
ls -la frontend/src/utils/
ls -la frontend/src/styles/

# Expected files in components/:
# - Canvas3D.jsx
# - ECGUpload.jsx
# - AnalysisDashboard.jsx
# - ArrhythmiaWarning.jsx
# - AIReviewPanel.jsx
# - RecommendationsPanel.jsx
# - TrustSection.jsx
# - ErrorBoundary.jsx
# - AccessibilityWrapper.jsx
# - GlassmorphismPanel.jsx

# Expected files in hooks/:
# - useStore.js

# Expected files in utils/:
# - api.js
# - websocket.js
# - mockBackend.js
# - renderOptimization.js

# Expected files in styles/:
# - tokens.css
# - accessibility.css
```

### 4. Check Model Files

```bash
# Verify model files
ls -la model/train.py
ls -la model/heart_model.pt
ls -la model/testecg.py

# Expected: All files should exist
```

### 5. Check Dependencies

```bash
# Backend dependencies
cd backend
pip list | grep -E "fastapi|torch|numpy|pandas|scipy"

# Expected: All packages installed

# Frontend dependencies
cd ../frontend
npm list | grep -E "react|three|framer-motion|zustand|tailwindcss"

# Expected: All packages installed
```

---

## Detailed Verification Checklist

### ✅ Backend Verification

- [ ] `backend/main.py` exists
  ```bash
  test -f backend/main.py && echo "✓ main.py exists" || echo "✗ main.py missing"
  ```

- [ ] `backend/requirements.txt` exists
  ```bash
  test -f backend/requirements.txt && echo "✓ requirements.txt exists" || echo "✗ requirements.txt missing"
  ```

- [ ] FastAPI installed
  ```bash
  python -c "import fastapi; print('✓ FastAPI installed')" 2>/dev/null || echo "✗ FastAPI not installed"
  ```

- [ ] PyTorch installed
  ```bash
  python -c "import torch; print('✓ PyTorch installed')" 2>/dev/null || echo "✗ PyTorch not installed"
  ```

- [ ] Backend can start
  ```bash
  cd backend
  timeout 5 uvicorn main:app --reload 2>&1 | grep -q "Uvicorn running" && echo "✓ Backend starts" || echo "✗ Backend error"
  ```

- [ ] Model file exists
  ```bash
  test -f model/heart_model.pt && echo "✓ Model file exists" || echo "✗ Model file missing"
  ```

### ✅ Frontend Verification

- [ ] `frontend/package.json` exists
  ```bash
  test -f frontend/package.json && echo "✓ package.json exists" || echo "✗ package.json missing"
  ```

- [ ] `frontend/src/App.jsx` exists
  ```bash
  test -f frontend/src/App.jsx && echo "✓ App.jsx exists" || echo "✗ App.jsx missing"
  ```

- [ ] React installed
  ```bash
  cd frontend
  npm list react 2>/dev/null | grep -q "react@" && echo "✓ React installed" || echo "✗ React not installed"
  ```

- [ ] Three.js installed
  ```bash
  cd frontend
  npm list three 2>/dev/null | grep -q "three@" && echo "✓ Three.js installed" || echo "✗ Three.js not installed"
  ```

- [ ] Zustand installed
  ```bash
  cd frontend
  npm list zustand 2>/dev/null | grep -q "zustand@" && echo "✓ Zustand installed" || echo "✗ Zustand not installed"
  ```

- [ ] Tailwind CSS installed
  ```bash
  cd frontend
  npm list tailwindcss 2>/dev/null | grep -q "tailwindcss@" && echo "✓ Tailwind installed" || echo "✗ Tailwind not installed"
  ```

- [ ] All components exist
  ```bash
  for file in Canvas3D ECGUpload AnalysisDashboard ArrhythmiaWarning AIReviewPanel RecommendationsPanel TrustSection ErrorBoundary AccessibilityWrapper GlassmorphismPanel; do
    test -f "frontend/src/components/${file}.jsx" && echo "✓ ${file}.jsx" || echo "✗ ${file}.jsx missing"
  done
  ```

- [ ] All hooks exist
  ```bash
  test -f frontend/src/hooks/useStore.js && echo "✓ useStore.js exists" || echo "✗ useStore.js missing"
  ```

- [ ] All utilities exist
  ```bash
  for file in api websocket mockBackend renderOptimization; do
    test -f "frontend/src/utils/${file}.js" && echo "✓ ${file}.js" || echo "✗ ${file}.js missing"
  done
  ```

- [ ] All styles exist
  ```bash
  for file in tokens accessibility; do
    test -f "frontend/src/styles/${file}.css" && echo "✓ ${file}.css" || echo "✗ ${file}.css missing"
  done
  ```

- [ ] Frontend can start
  ```bash
  cd frontend
  timeout 10 npm run dev 2>&1 | grep -q "Local:" && echo "✓ Frontend starts" || echo "✗ Frontend error"
  ```

### ✅ Model Verification

- [ ] `model/train.py` exists
  ```bash
  test -f model/train.py && echo "✓ train.py exists" || echo "✗ train.py missing"
  ```

- [ ] `model/testecg.py` exists
  ```bash
  test -f model/testecg.py && echo "✓ testecg.py exists" || echo "✗ testecg.py missing"
  ```

- [ ] `model/heart_model.pt` exists
  ```bash
  test -f model/heart_model.pt && echo "✓ heart_model.pt exists" || echo "✗ heart_model.pt missing"
  ```

- [ ] Training dataset exists
  ```bash
  test -f mitbih_train.csv && echo "✓ mitbih_train.csv exists" || echo "✗ mitbih_train.csv missing"
  ```

### ✅ Configuration Files

- [ ] `frontend/vite.config.js` exists
  ```bash
  test -f frontend/vite.config.js && echo "✓ vite.config.js exists" || echo "✗ vite.config.js missing"
  ```

- [ ] `frontend/tailwind.config.js` exists
  ```bash
  test -f frontend/tailwind.config.js && echo "✓ tailwind.config.js exists" || echo "✗ tailwind.config.js missing"
  ```

- [ ] `frontend/postcss.config.js` exists
  ```bash
  test -f frontend/postcss.config.js && echo "✓ postcss.config.js exists" || echo "✗ postcss.config.js missing"
  ```

- [ ] `frontend/vitest.config.js` exists
  ```bash
  test -f frontend/vitest.config.js && echo "✓ vitest.config.js exists" || echo "✗ vitest.config.js missing"
  ```

### ✅ Documentation Files

- [ ] `SETUP.md` exists
  ```bash
  test -f SETUP.md && echo "✓ SETUP.md exists" || echo "✗ SETUP.md missing"
  ```

- [ ] `INTEGRATION_GUIDE.md` exists
  ```bash
  test -f INTEGRATION_GUIDE.md && echo "✓ INTEGRATION_GUIDE.md exists" || echo "✗ INTEGRATION_GUIDE.md missing"
  ```

- [ ] `VERIFY.md` exists (this file)
  ```bash
  test -f VERIFY.md && echo "✓ VERIFY.md exists" || echo "✗ VERIFY.md missing"
  ```

---

## Automated Verification Script

Create a file `verify.sh`:

```bash
#!/bin/bash

echo "🔍 HeartSafe AI - Complete Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check file
check_file() {
    if test -f "$1"; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        ((FAILED++))
    fi
}

# Function to check directory
check_dir() {
    if test -d "$1"; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ (MISSING)"
        ((FAILED++))
    fi
}

# Function to check command
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 installed"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 not installed"
        ((FAILED++))
    fi
}

echo "📁 Checking Directories..."
check_dir "backend"
check_dir "frontend"
check_dir "model"
check_dir "frontend/src"
check_dir "frontend/src/components"
check_dir "frontend/src/hooks"
check_dir "frontend/src/utils"
check_dir "frontend/src/styles"
echo ""

echo "📄 Checking Backend Files..."
check_file "backend/main.py"
check_file "backend/requirements.txt"
echo ""

echo "📄 Checking Frontend Files..."
check_file "frontend/package.json"
check_file "frontend/src/App.jsx"
check_file "frontend/src/main.jsx"
check_file "frontend/src/index.css"
check_file "frontend/vite.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
echo ""

echo "🎨 Checking Components..."
for component in Canvas3D ECGUpload AnalysisDashboard ArrhythmiaWarning AIReviewPanel RecommendationsPanel TrustSection ErrorBoundary AccessibilityWrapper GlassmorphismPanel; do
    check_file "frontend/src/components/${component}.jsx"
done
echo ""

echo "🪝 Checking Hooks..."
check_file "frontend/src/hooks/useStore.js"
echo ""

echo "🔧 Checking Utilities..."
check_file "frontend/src/utils/api.js"
check_file "frontend/src/utils/websocket.js"
check_file "frontend/src/utils/mockBackend.js"
check_file "frontend/src/utils/renderOptimization.js"
echo ""

echo "🎨 Checking Styles..."
check_file "frontend/src/styles/tokens.css"
check_file "frontend/src/styles/accessibility.css"
echo ""

echo "🤖 Checking Model Files..."
check_file "model/train.py"
check_file "model/testecg.py"
check_file "model/heart_model.pt"
check_file "mitbih_train.csv"
echo ""

echo "📚 Checking Documentation..."
check_file "SETUP.md"
check_file "INTEGRATION_GUIDE.md"
check_file "VERIFY.md"
echo ""

echo "🔧 Checking Commands..."
check_command "node"
check_command "npm"
check_command "python"
check_command "pip"
echo ""

echo "========================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review above.${NC}"
    exit 1
fi
```

Run it:
```bash
chmod +x verify.sh
./verify.sh
```

---

## Runtime Verification

### 1. Check Backend is Running

```bash
# Test health endpoint
curl http://localhost:8000/

# Expected response:
# {"status":"online","model_loaded":true,"api":"HeartSafe AI v1.0"}
```

### 2. Check Frontend is Running

```bash
# Test frontend
curl http://localhost:5173/

# Expected: HTML page loads
```

### 3. Test API Endpoint

```bash
# Create test ECG data
cat > test_ecg.json << 'EOF'
{
  "signal": [0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, 0.5, 0.3, 0.2, 0.1, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5]
}
EOF

# Test API
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d @test_ecg.json

# Expected: JSON response with analysis results
```

---

## Summary Checklist

- [ ] All backend files present
- [ ] All frontend files present
- [ ] All model files present
- [ ] All dependencies installed
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] API health check passes
- [ ] API analysis endpoint works
- [ ] 3D visualization renders
- [ ] File upload works
- [ ] Analysis results display
- [ ] Documentation complete

If all checks pass, your system is **100% complete and ready to use**! ✅
