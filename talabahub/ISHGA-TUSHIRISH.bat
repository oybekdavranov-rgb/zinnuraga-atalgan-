@echo off
title TalabaHub
cd /d "%~dp0"
set SITE_PROFILE=hub
if "%PORT%"=="" set PORT=3100
node server.js
pause
