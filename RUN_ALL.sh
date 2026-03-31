#!/bin/bash

# HeartSafe AI - Complete Startup Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🫀 HeartSafe AI - Complete Startup 🫀             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Make scripts executable
chmod +x RUN_BACKEND.sh
chmod +x RUN_FRONTEND.sh

echo "📋 Starting both servers..."
echo ""

# Start backend in background
echo "1️⃣  Starting Backend Server..."
./RUN_BACKEND.sh &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 3

echo ""
echo "2️⃣  Starting Frontend Server..."
./RUN_FRONTEND.sh &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 3

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ SERVERS RUNNING ✅                    ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  🌐 Website:  http://localhost:5173                       ║"
echo "║  📡 Backend:  http://localhost:8000                       ║"
echo "║  ✅ Health:   http://localhost:8000/health                ║"
echo "║                                                            ║"
echo "║  Press Ctrl+C to stop all servers                         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
