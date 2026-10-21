@echo off
title JobRdy - Deploy to Azure Static Web Apps
echo =========================================================
echo       Deploying JobRdy to Microsoft Azure
echo =========================================================
cd /d "%~dp0"
echo 1. Building production bundle...
call npm run build
echo 2. Uploading assets to Azure Static Web Apps...
call npx -y @azure/static-web-apps-cli deploy ./dist --deployment-token 487f1fae4615d85648b33cdbafdc61f0cd44465132aa12c0f8e6f761e843964d01-bfdbe011-fa0b-49aa-8ea5-f9e310682a3500f23230297cbc0f --env production
echo =========================================================
echo   Deployment Complete!
echo   Visit: https://lively-wave-0297cbc0f.1.azurestaticapps.net
echo =========================================================
pause
