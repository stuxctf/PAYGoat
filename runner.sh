#!/bin/bash

echo "[INFO] Checking for Node.js and npm..."

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Download it from: https://nodejs.org"
    read -p "Press [Enter] to exit..."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed. It comes with Node.js."
    read -p "Press [Enter] to exit..."
    exit 1
fi

echo "[OK] Node.js and npm are installed."

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "[INFO] Installing backend dependencies..."
    (cd backend && npm install)
else
    echo "[INFO] Backend dependencies already installed."
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "[INFO] Installing frontend dependencies..."
    (cd frontend && npm install)
else
    echo "[INFO] Frontend dependencies already installed."
fi

# Start backend in background
echo "[INFO] Starting backend server..."
(cd backend && node server.js > ../backend.log 2>&1) &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Start frontend in background
echo "[INFO] Starting frontend server on http://localhost:8000..."
(cd frontend && npm start > ../frontend.log 2>&1) &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

# Show real PIDs
echo ""
echo "[SUCCESS] Servers running in background:"
echo "  Backend PID: $BACKEND_PID (log: backend.log)"
echo "  Frontend PID: $FRONTEND_PID (log: frontend.log)"

echo ""
read -p "Press [Enter] to exit this script. Servers will continue running in background..."
