@echo off
title Khoi dong POWORK Web App
echo ===================================================
echo   DANG KHOI DONG HE THONG POWORK (FRONTEND + BACKEND)
echo ===================================================
echo.
echo 1. Dang build va chay cac container bang Docker...
docker compose up --build -d
echo.
echo ===================================================
echo   KHOI DONG THANH CONG!
echo ===================================================
echo - Giao dien web (Frontend): http://localhost:3000
echo - Cong API (Backend):       http://localhost:3001
echo ===================================================
echo Nhan mot phim bat ky de tu dong mo website tren trinh duyet...
pause
start http://localhost:3000
