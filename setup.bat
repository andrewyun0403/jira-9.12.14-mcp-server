@echo off
echo Setting up Jira 9.12.14 MCP Server...

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

REM Check Node.js version (simplified check)
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_VERSION=%%a
)
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 16 (
    echo Node.js version must be v16 or higher. Current version: node -v
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Build the project
echo Building the project...
call npm run build

REM Copy .env.example to .env if it doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
    echo Please edit the .env file to add your Jira credentials.
)

echo Setup complete! To run the server, use:
echo npm start
echo.
echo Remember to configure your JIRA_API_URL and JIRA_AUTH_TOKEN in the .env file. 