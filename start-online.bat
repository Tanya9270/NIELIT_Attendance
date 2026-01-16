@echo off
echo ==========================================
echo   QR Attendance - Online Classes Setup
echo ==========================================
echo.

REM Start the backend server
echo Starting backend server...
start "Backend Server" cmd /k "cd /d c:\Users\Tanya Singh\Downloads\attendence\server && node index.js"

REM Wait for server to start
timeout /t 3 /nobreak > nul

REM Start ngrok tunnel for backend
echo Starting ngrok tunnel for API (port 3000)...
start "Ngrok Backend" cmd /k "cd /d c:\Users\Tanya Singh\Downloads\attendence && ngrok http 3000"

REM Start the frontend
echo Starting frontend...
start "Frontend" cmd /k "cd /d c:\Users\Tanya Singh\Downloads\attendence\client && npm run dev"

REM Wait for frontend
timeout /t 5 /nobreak > nul

REM Start ngrok tunnel for frontend
echo Starting ngrok tunnel for Frontend (port 5173)...
start "Ngrok Frontend" cmd /k "cd /d c:\Users\Tanya Singh\Downloads\attendence && ngrok http https://localhost:5173"

echo.
echo ==========================================
echo   IMPORTANT: Copy the ngrok URLs!
echo ==========================================
echo.
echo After ngrok windows open, you'll see URLs like:
echo   https://xxxx-xxx-xxx.ngrok-free.app
echo.
echo Share the FRONTEND ngrok URL with students!
echo.
pause
