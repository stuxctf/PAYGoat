@echo off

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed. Download it from: https://nodejs.org
    pause
    exit /b
)

where npm >nul 2>nul
if errorlevel 1 (
    echo npm is not installed. It comes with Node.js
    pause
    exit /b
)

echo Node.js and npm are installed.

if exist backend\node_modules (
    echo Backend dependencies already installed.
) else (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if exist frontend\node_modules (
    echo Frontend dependencies already installed.
) else (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo Starting servers in new terminals...

start "Backend" cmd /k "cd backend && node server.js"
start "Frontend" cmd /k "cd frontend && echo Frontend running at http://localhost:8000 && npm start"

echo Servers running.
pause
