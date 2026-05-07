@echo off
REM Shadow's Tower RPG - Build Script for Windows

title Shadow's Tower RPG - Build & Run
cls
echo =========================================
echo Shadow's Tower RPG - Build ^& Run Script
echo =========================================
echo.

REM Check if Java is installed
where javac >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java SE 11 or higher
    pause
    exit /b 1
)

color 0A
echo Found Java:
javac -version
echo.

REM Create bin directory if it doesn't exist
echo Creating bin directory...
if not exist bin mkdir bin

echo.
color 0E
echo Compiling Java source files...
javac -d bin src\com\shadowrpg\*\*.java

if %ERRORLEVEL% EQU 0 (
    color 0A
    echo.
    echo Compilation successful!
    echo.
    set /p runGame=Do you want to run the game now (y/n)? 
    if /i "%runGame%"=="y" (
        color 0B
        echo.
        echo Starting Shadow's Tower RPG...
        echo.
        java -cp bin com.shadowrpg.core.Game
    )
) else (
    color 0C
    echo.
    echo Compilation failed!
    echo Please check for errors in the source code
    pause
    exit /b 1
)

pause
