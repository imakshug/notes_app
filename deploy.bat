@echo off
REM Simple deployment script for Notes App (Windows version)
REM Make sure you have the necessary CLI tools installed:
REM npm install -g vercel netlify-cli

echo 🚀 Starting deployment process for Notes App...

REM Build the project
echo 📦 Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix the errors and try again.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Ask user which platform to deploy to
echo Where would you like to deploy?
echo 1^) Vercel
echo 2^) Netlify
echo 3^) Both
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Vercel...
    call vercel --prod
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Netlify...
    call netlify deploy --prod --dir=dist
) else if "%choice%"=="3" (
    echo 🚀 Deploying to both platforms...
    echo Deploying to Vercel first...
    call vercel --prod
    echo Now deploying to Netlify...
    call netlify deploy --prod --dir=dist
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment complete!
echo 📋 Next steps:
echo    1. Check your deployment URLs in the platform dashboards
echo    2. Update your backend ALLOWED_ORIGINS with the new frontend URLs
echo    3. Test the deployed application
echo.
echo 📚 For more detailed deployment instructions, see DEPLOYMENT.md
pause