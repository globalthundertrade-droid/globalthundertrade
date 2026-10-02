@echo off
title Push to GitHub - Global Thunder Trade
color 0A
cd /d "c:\Users\Huzaima Irfan\Desktop\Global Thunder Trade"
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\ucrt64\bin;%PATH%"

echo ========================================================
echo    GLOBAL THUNDER TRADE - PUSH TO GITHUB REPOSITORY
echo ========================================================
echo.
echo Remote: https://github.com/globalthundertrade-droid/globalthundertrade.git
echo Branch: main
echo.
echo Running: git push -u origin main ...
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  SUCCESS! All code, CMS files, and assets pushed!
    echo ========================================================
) else (
    echo ========================================================
    echo  Push encountered an issue. See message above.
    echo ========================================================
)
echo.
pause
