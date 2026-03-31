#!/bin/bash

# HeartSafe AI - Frontend Startup Script

echo "🎨 Starting HeartSafe AI Frontend..."
echo ""

# Navigate to frontend directory
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Start the dev server
echo ""
echo "✅ Frontend is starting..."
echo ""
echo "📍 Website: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
