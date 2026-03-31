#!/bin/bash

echo "🔍 HeartSafe AI - Complete Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

check_file() {
    if test -f "$1"; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        ((FAILED++))
    fi
}

check_dir() {
    if test -d "$1"; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ (MISSING)"
        ((FAILED++))
    fi
}

echo "📁 Directories..."
check_dir "backend"
check_dir "frontend"
check_dir "model"
check_dir "frontend/src/components"
check_dir "frontend/src/hooks"
check_dir "frontend/src/utils"
check_dir "frontend/src/styles"
echo ""

echo "📄 Backend Files..."
check_file "backend/main.py"
check_file "backend/requirements.txt"
echo ""

echo "📄 Frontend Files..."
check_file "frontend/package.json"
check_file "frontend/src/App.jsx"
check_file "frontend/vite.config.js"
check_file "frontend/tailwind.config.js"
echo ""

echo "🎨 Components..."
for component in Canvas3D ECGUpload AnalysisDashboard ArrhythmiaWarning AIReviewPanel RecommendationsPanel TrustSection ErrorBoundary AccessibilityWrapper; do
    check_file "frontend/src/components/${component}.jsx"
done
echo ""

echo "🔧 Utilities..."
check_file "frontend/src/utils/api.js"
check_file "frontend/src/utils/mockBackend.js"
check_file "frontend/src/hooks/useStore.js"
echo ""

echo "🤖 Model Files..."
check_file "model/train.py"
check_file "model/heart_model.pt"
check_file "mitbih_train.csv"
echo ""

echo "📚 Documentation..."
check_file "SETUP.md"
check_file "INTEGRATION_GUIDE.md"
check_file "VERIFY.md"
echo ""

echo "========================================"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Failed: $FAILED${NC}"
else
    echo -e "${GREEN}✗ Failed: 0${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All files present! System is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. cd backend && pip install -r requirements.txt"
    echo "2. uvicorn main:app --reload"
    echo "3. cd frontend && npm install"
    echo "4. npm run dev"
    exit 0
else
    echo -e "${RED}❌ Some files are missing. Please check above.${NC}"
    exit 1
fi
