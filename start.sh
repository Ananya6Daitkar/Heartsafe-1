#!/bin/bash

# HeartSafe AI - Complete Startup Script

echo "🚀 Starting HeartSafe AI..."
echo ""

# Check if backend is running
echo "📡 Checking backend..."
if ! curl -s http://localhost:8000/ > /dev/null; then
    echo "Starting backend server..."
    cd backend
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "✓ Backend started (PID: $BACKEND_PID)"
    sleep 2
    cd ..
else
    echo "✓ Backend already running"
fi

# Check if frontend is running
echo ""
echo "🎨 Checking frontend..."
if ! curl -s http://localhost:5173/ > /dev/null; then
    echo "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "✓ Frontend started (PID: $FRONTEND_PID)"
    sleep 2
    cd ..
else
    echo "✓ Frontend already running"
fi

echo ""
echo "✅ HeartSafe AI is ready!"
echo ""
echo "📍 Access the application at: http://localhost:5173"
echo "📡 Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait
