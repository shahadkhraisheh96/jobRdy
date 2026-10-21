@echo off
title JobRdy - Career Preparation & ATS Suite
echo ===================================================
echo           Launching JobRdy Web App
echo ===================================================
cd /d "%~dp0"
echo Starting development server on http://localhost:5174/ ...
npm run dev -- --host 127.0.0.1 --port 5174
pause
