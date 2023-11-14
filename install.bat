@echo off
echo Installing Disney Waitlist Joiner...

rem Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
  echo Node.js is not installed. Please download and install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

rem Check if npm is installed
npm -v >nul 2>&1
if %errorlevel% neq 0 (
  echo npm is not installed. Please make sure Node.js includes npm when installed.
  pause
  exit /b 1
)

rem Install project dependencies
npm install

echo Disney Waitlist Joiner is installed.
echo Please follow the instructions in the README.md file to use the script.
pause
