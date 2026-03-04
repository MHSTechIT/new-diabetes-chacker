@echo off
cd /d "%~dp0"
set REPO=github.com/MHSTechIT/new-diabetes-chacker.git

if defined GITHUB_TOKEN (
  echo Pushing to GitHub using GITHUB_TOKEN...
  git push https://%GITHUB_TOKEN%@%REPO% main
  if %errorlevel% equ 0 git branch -u origin/main main 2>nul
) else (
  echo Pushing to GitHub. You may be asked for username and password.
  echo Use your GitHub username and a Personal Access Token as password.
  echo.
  git push -u origin main
)

echo.
if %errorlevel% neq 0 echo Push failed. If no token: set GITHUB_TOKEN=your_token then run this again.
pause
