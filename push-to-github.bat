@echo off
cd /d "%~dp0"
echo Pushing to GitHub. You may be asked for username and password.
echo Use your GitHub username and a Personal Access Token as password.
echo.
git push -u origin main
echo.
pause
