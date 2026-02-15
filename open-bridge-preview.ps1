# Open Bridge Page Preview
# Starts Python HTTP server on port 8080 and opens the bridge page in default browser

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting HTTP server on port 8080..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server when done." -ForegroundColor Yellow
Write-Host ""

# Start Python HTTP server in background
Start-Process python -ArgumentList "-m http.server 8080" -WindowStyle Minimized

# Wait for server to start
Start-Sleep -Seconds 2

# Open bridge page in default browser
$url = "http://localhost:8080/app/ELP-ELP-PASO.html"
Write-Host "Opening: $url" -ForegroundColor Green
Start-Process $url

Write-Host ""
Write-Host "Server is running. Close the minimized Python window when done." -ForegroundColor Cyan
