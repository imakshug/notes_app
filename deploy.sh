#!/bin/bash

# Simple deployment script for Notes App
# Make sure you have the necessary CLI tools installed:
# npm install -g vercel netlify-cli

echo "🚀 Starting deployment process for Notes App..."

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Ask user which platform to deploy to
echo ""
echo "Where would you like to deploy?"
echo "1) Vercel"
echo "2) Netlify" 
echo "3) Both"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        ;;
    3)
        echo "🚀 Deploying to both platforms..."
        echo "Deploying to Vercel first..."
        vercel --prod
        echo "Now deploying to Netlify..."
        netlify deploy --prod --dir=dist
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "   1. Check your deployment URLs in the platform dashboards"
echo "   2. Update your backend ALLOWED_ORIGINS with the new frontend URLs"
echo "   3. Test the deployed application"
echo ""
echo "📚 For more detailed deployment instructions, see DEPLOYMENT.md"