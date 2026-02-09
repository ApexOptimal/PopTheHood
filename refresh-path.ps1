# Refresh PATH in current PowerShell session
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify Git is now available
Write-Host "Refreshing PATH..." -ForegroundColor Green
git --version
Write-Host "`nGit is now available in this session!" -ForegroundColor Green
