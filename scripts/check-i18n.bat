@echo off
setlocal enabledelayedexpansion

REM i18n Code Validation Script for Windows
REM This script checks for hardcoded Chinese/English text that should be internationalized

echo 🔍 Checking for i18n issues in TypeScript/TSX files...
echo.

REM Counter for issues found
set ISSUES=0

echo 1️⃣  Checking for hardcoded Chinese in JSX...
echo    (Looking for Chinese characters between ^> and ^< tags)
echo.

REM Find hardcoded Chinese in JSX (using PowerShell)
powershell -Command "$results = Get-ChildItem -Path app,components -Filter *.tsx -Recurse | Select-String -Pattern '>[^<]*[\u4e00-\u9fa5]+[^<]*<' | Where-Object { $_.Line -notmatch '//' -and $_.Line -notmatch \"locale === 'zh'\" -and $_.Line -notmatch 'isChina \?' }; if ($results) { $results | ForEach-Object { Write-Host \"$($_.Path):$($_.LineNumber):$($_.Line)\" } }" > temp_chinese.txt

set /p CHINESE_CHECK=<temp_chinese.txt
del temp_chinese.txt

if "%CHINESE_CHECK%"=="" (
  echo [OK] No hardcoded Chinese text found in JSX
) else (
  echo [ERROR] Found hardcoded Chinese text:
  echo %CHINESE_CHECK%
  echo.
  set /a ISSUES+=1
)

echo.
echo 2️⃣  Checking for hardcoded English user-facing text...
echo    (Looking for English phrases ^>10 chars in JSX)
echo.

REM Find potential hardcoded English in JSX (using PowerShell)
powershell -Command "$results = Get-ChildItem -Path app,components -Filter *.tsx -Recurse | Select-String -Pattern '>[A-Z][A-Za-z\s]{10,}<' | Where-Object { $_.Line -notmatch '//' -and $_.Line -notmatch \"locale === 'zh'\" -and $_.Line -notmatch 'isChina \?' -and $_.Line -notmatch 'aria-' -and $_.Line -notmatch 'data-testid' }; if ($results) { $results | ForEach-Object { Write-Host \"$($_.Path):$($_.LineNumber):$($_.Line)\" } }" > temp_english.txt

set /p ENGLISH_CHECK=<temp_english.txt
del temp_english.txt

if "%ENGLISH_CHECK%"=="" (
  echo [OK] No hardcoded English text found in JSX
) else (
  echo [WARNING] Found potential hardcoded English (review manually):
  echo %ENGLISH_CHECK%
  echo.
  echo    Note: Some results may be legitimate (aria-labels, test IDs)
  echo.
  set /a ISSUES+=1
)

echo.
echo 3️⃣  Checking for '寻找攻擂者' text...
echo.

REM Find hardcoded "寻找攻擂者"
findstr /S /C:"寻找攻擂者" app\*.tsx components\*.tsx > temp_challenger.txt 2>nul

set /p CHALLENGER_CHECK=<temp_challenger.txt
del temp_challenger.txt

if "%CHALLENGER_CHECK%"=="" (
  echo [OK] No '寻找攻擂者' hardcoded text found
) else (
  echo [WARNING] Found '寻找攻擂者' (ensure it's filtered in display logic):
  echo %CHALLENGER_CHECK%
  echo.
  set /a ISSUES+=1
)

echo.
echo ═══════════════════════════════════════════════════
if %ISSUES%==0 (
  echo [SUCCESS] All i18n checks passed!
  echo.
  echo Your code follows proper internationalization practices.
  exit /b 0
) else (
  echo [ERROR] Found %ISSUES% potential i18n issue(s)
  echo.
  echo Please review the results above and fix any hardcoded text.
  echo Remember to use: {locale === 'zh' ? '中文' : 'English'}
  exit /b 1
)
