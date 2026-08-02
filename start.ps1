Write-Host "🧠 Brain Tumor Detection System - Quick Start" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Resolve paths from script location
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
$backendPath = Join-Path $scriptPath "backend"
$frontendPath = $scriptPath
$venvPython = Join-Path $backendPath "venv\Scripts\python.exe"

# Store process IDs for cleanup
$backendProcess = $null
$frontendProcess = $null

function Test-HttpEndpoint {
    param([string]$Uri)
    try {
        $response = Invoke-WebRequest -Uri $Uri -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    }
    catch {
        return $false
    }
}

function Cleanup {
    Write-Host "`n⏹️ Shutting down services..." -ForegroundColor Yellow
    
    if ($backendProcess) {
        try {
            Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Backend stopped." -ForegroundColor Green
        }
        catch { }
    }
    
    if ($frontendProcess) {
        try {
            Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Frontend stopped." -ForegroundColor Green
        }
        catch { }
    }

    Write-Host "Goodbye!" -ForegroundColor Cyan
}

# Register cleanup for Ctrl+C
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

if (-not (Test-Path $venvPython)) {
    Write-Host "❌ Virtual environment Python not found at backend\venv\" -ForegroundColor Red
    Write-Host "Creating backend virtual environment..." -ForegroundColor Yellow
    if (Get-Command py -ErrorAction SilentlyContinue) {
        & py -3.11 -m venv "$backendPath\venv"
    }
    else {
        & python -m venv "$backendPath\venv"
    }

    if (-not (Test-Path $venvPython)) {
        Write-Host "Failed to create the virtual environment." -ForegroundColor Red
        exit 1
    }

    Write-Host "Installing backend requirements..." -ForegroundColor Yellow
    & $venvPython -m pip install -r "$backendPath\requirements.txt" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Backend dependency installation failed." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Virtual environment ready." -ForegroundColor Green

if (-not (Test-Path "$frontendPath\node_modules")) {
    Write-Host "❌ Node modules not found!" -ForegroundColor Red
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    & npm install | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Frontend dependency installation failed." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Node modules ready." -ForegroundColor Green

# Kill any existing processes on these ports
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

Write-Host "✅ Starting Backend Server..." -ForegroundColor Green
$backendCommand = "& '$venvPython' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
$backendProcess = Start-Process powershell -WorkingDirectory $backendPath -ArgumentList '-NoExit', '-Command', $backendCommand -PassThru
Write-Host "   API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Docs: http://localhost:8000/docs" -ForegroundColor Cyan

Write-Host "✅ Starting Frontend Server..." -ForegroundColor Green
$frontendProcess = Start-Process powershell -WorkingDirectory $frontendPath -ArgumentList '-NoExit', '-Command', 'npm.cmd run dev' -PassThru
Write-Host "   App: http://localhost:3000" -ForegroundColor Cyan

Write-Host ""
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
$deadline = (Get-Date).AddMinutes(2)
while ((Get-Date) -lt $deadline) {
    $backendReady = Test-HttpEndpoint "http://127.0.0.1:8000/health"
    $frontendReady = Test-HttpEndpoint "http://127.0.0.1:3000"

    if ($backendReady -and $frontendReady) {
        break
    }

    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "🚀 System is running!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit (this will close both servers)"
Cleanup
