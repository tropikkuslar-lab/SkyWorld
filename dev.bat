@echo off
REM SkyWorld v2.0 - Windows Development Script
REM @author MiniMax Agent

setlocal enabledelayedexpansion

echo SkyWorld v2.0 Development Script
echo ===============================

REM Check if command argument is provided
if "%~1"=="" (
    goto help
)

REM Function to install dependencies
:install
echo Installing dependencies...
if exist npm (
    npm install
) else if exist yarn (
    yarn install
) else (
    echo Error: No package manager found. Please install npm or yarn.
    exit /b 1
)
echo Dependencies installed successfully
goto :eof

REM Function to start development server
:dev
echo Starting development server...
if exist npx (
    npx live-server --port=8080 --open=/index.html --cors=true --entry-file=/index.html
) else if exist http-server (
    http-server -p 8080 -c-1 --cors
) else if exist python (
    python -m http.server 8080
) else (
    echo Error: No suitable development server found.
    echo Please install one of: npx, http-server, or python
    exit /b 1
)
goto :eof

REM Function to build for production
:build
echo Building for production...

REM Create build directory
if exist dist rmdir /s /q dist
mkdir dist

REM Copy essential files
copy index.html dist\ >nul
if exist src xcopy /s /e /y src dist\src\ >nul
if exist assets xcopy /s /e /y assets dist\assets\ >nul
if exist docs xcopy /s /e /y docs dist\docs\ >nul
copy package.json dist\ >nul
copy README.md dist\ >nul
copy LICENSE dist\ >nul
copy sw.js dist\ >nul
copy site.webmanifest dist\ >nul

echo Production build completed in dist\
goto :eof

REM Function to deploy to GitHub Pages
:deploy
echo Deploying to GitHub Pages...
if exist npx (
    call :build
    npx gh-pages -d dist -m "Deploy SkyWorld v2.0"
) else (
    echo Error: npx is required for deployment
    exit /b 1
)
echo Deployed to GitHub Pages successfully
goto :eof

REM Function to run linting
:lint
echo Running linter...

REM Check for console.log statements (basic check)
findstr /s /i "console\.log" src\*.js >nul
if not errorlevel 1 (
    echo Warning: Found console.log statements in source code
)

REM Check for TODO comments
findstr /s /i "TODO" src\*.js >nul
if not errorlevel 1 (
    echo Warning: Found TODO comments in source code
)

REM Check for debugger statements
findstr /s /i "debugger" src\*.js >nul
if not errorlevel 1 (
    echo Warning: Found debugger statements in source code
)

echo Linting completed
goto :eof

REM Function to analyze bundle size
:analyze
echo Analyzing bundle size...

if exist index.html (
    for %%A in (index.html) do echo index.html: %%~zA bytes
)

REM Count JavaScript files and lines (basic check)
dir src\*.js /s /b > temp_files.txt
if exist temp_files.txt (
    set /a js_files=0
    for /f %%f in (temp_files.txt) do (
        set /a js_files+=1
    )
    echo JavaScript files: !js_files!
    del temp_files.txt
)

echo Bundle analysis completed
goto :eof

REM Function to clean build artifacts
:clean
echo Cleaning build artifacts...
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
if exist .cache rmdir /s /q .cache
if exist .parcel-cache rmdir /s /q .parcel-cache
echo Clean completed
goto :eof

REM Function to show help
:help
echo SkyWorld v2.0 Development Script
echo.
echo Usage: %~nx0 [COMMAND]
echo.
echo Commands:
echo   install    Install project dependencies
echo   dev        Start development server
echo   build      Build for production
echo   deploy     Deploy to GitHub Pages
echo   lint       Run code analysis
echo   analyze    Analyze bundle size
echo   clean      Clean build artifacts
echo   help       Show this help message
echo.
echo Examples:
echo   %~nx0 install    # Install dependencies
echo   %~nx0 dev        # Start development server
echo   %~nx0 deploy     # Deploy to GitHub Pages
goto :eof

REM Main script logic
:start
if "%~1"=="install" goto install
if "%~1"=="dev" goto dev
if "%~1"=="build" goto build
if "%~1"=="deploy" goto deploy
if "%~1"=="lint" goto lint
if "%~1"=="analyze" goto analyze
if "%~1"=="clean" goto clean
if "%~1"=="help" goto help
if "%~1"=="--help" goto help
if "%~1"=="-h" goto help

echo Error: Unknown command: %~1
goto help

endlocal