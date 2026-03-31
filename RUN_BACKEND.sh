#!/bin/bash

# HeartSafe AI - Backend Startup Script

echo "🚀 Starting HeartSafe AI Backend..."
echo ""

# Navigate to backend directory
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Start the server
echo ""
echo "✅ Backend is starting..."
echo ""
echo "📍 API Server: http://localhost:8000"
echo "📍 Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
