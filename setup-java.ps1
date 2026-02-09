# Script to find and configure Java JDK for Android development

Write-Host "Searching for Java JDK installation..." -ForegroundColor Cyan

# Common installation paths
$searchPaths = @(
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Java",
    "C:\Program Files (x86)\Java",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium",
    "$env:ProgramFiles\Eclipse Adoptium",
    "C:\Program Files\Microsoft",
    "$env:LOCALAPPDATA\Microsoft\WinGet\Packages"
)

$javaPath = $null

foreach ($path in $searchPaths) {
    if (Test-Path $path) {
        Write-Host "Checking: $path" -ForegroundColor Yellow
        $javaExe = Get-ChildItem -Path $path -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($javaExe) {
            $javaPath = $javaExe.DirectoryName
            Write-Host "Found Java at: $javaPath" -ForegroundColor Green
            break
        }
    }
}

if (-not $javaPath) {
    Write-Host "Java not found in common locations." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Java JDK 17:" -ForegroundColor Yellow
    Write-Host "  winget install EclipseAdoptium.Temurin.17.JDK" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or download from: https://adoptium.net/" -ForegroundColor Cyan
    exit 1
}

# Find JAVA_HOME (parent directory of bin)
$javaHome = Split-Path $javaPath -Parent

Write-Host ""
Write-Host "Java found!" -ForegroundColor Green
Write-Host "Java Path: $javaPath" -ForegroundColor White
Write-Host "JAVA_HOME should be: $javaHome" -ForegroundColor White
Write-Host ""

# Check current JAVA_HOME
$currentJavaHome = [Environment]::GetEnvironmentVariable("JAVA_HOME", "Machine")
if ($currentJavaHome) {
    Write-Host "Current JAVA_HOME (Machine): $currentJavaHome" -ForegroundColor Yellow
} else {
    $currentJavaHome = [Environment]::GetEnvironmentVariable("JAVA_HOME", "User")
    if ($currentJavaHome) {
        Write-Host "Current JAVA_HOME (User): $currentJavaHome" -ForegroundColor Yellow
    } else {
        Write-Host "JAVA_HOME is not set" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "To set JAVA_HOME, run these commands as Administrator:" -ForegroundColor Cyan
Write-Host "[Environment]::SetEnvironmentVariable('JAVA_HOME', '$javaHome', 'Machine')" -ForegroundColor White
Write-Host ""
Write-Host "Or manually:" -ForegroundColor Cyan
Write-Host "1. Press Win+R, type: sysdm.cpl" -ForegroundColor White
Write-Host "2. Advanced tab -> Environment Variables" -ForegroundColor White
Write-Host "3. System variables -> New" -ForegroundColor White
Write-Host "4. Variable name: JAVA_HOME" -ForegroundColor White
Write-Host "5. Variable value: $javaHome" -ForegroundColor White
Write-Host "6. Edit Path variable, add: %JAVA_HOME%\bin" -ForegroundColor White
Write-Host "7. Restart your terminal" -ForegroundColor White
