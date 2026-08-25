#!/bin/sh
# TalabaHub — ishga tushirish
cd "$(dirname "$0")"
SITE_PROFILE=hub PORT=${PORT:-3100} node server.js
