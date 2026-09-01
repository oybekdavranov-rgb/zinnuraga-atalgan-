@echo off
title Kokand University + Shaharcha
cd /d "%~dp0"
set SITE_PROFILE=all
if "%PORT%"=="" set PORT=3000
node server.js
pause
