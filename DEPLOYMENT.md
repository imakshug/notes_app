# Deployment Guide

This guide will help you deploy the Notes App to production using various platforms.

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) [Recommended]

#### Deploy Backend to Railway:
1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repository
4. Railway will auto-detect the Python backend in the `backend` folder
5. Add environment variables in Railway dashboard:
   - `SECRET_KEY`: Generate a secure random string
   - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-app.vercel.app`)
   - `DATABASE_URL`: Railway will provide a PostgreSQL database automatically
6. Railway will provide a public URL like `https://your-app.up.railway.app`

#### Deploy Frontend to Vercel:
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "New Project" → Import your GitHub repository
3. Vercel will auto-detect the Vite project
4. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL
5. Deploy - Vercel will provide a URL like `https://your-app.vercel.app`

### Option 2: Netlify (Frontend) + Render (Backend)

#### Deploy Backend to Render:
1. Go to [Render.com](https://render.com) and create account
2. Click "New" → "Web Service" → Connect GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables similar to Railway
6. Render provides PostgreSQL database add-on

#### Deploy Frontend to Netlify:
1. Go to [Netlify.com](https://netlify.com) and sign up
2. Drag & drop your `dist` folder, or connect GitHub
3. Build settings: Command `npm run build`, Publish directory `dist`
4. Add environment variables in Netlify dashboard

### Option 3: GitHub Pages (Static Frontend Only)

Your current GitHub Actions workflow deploys to GitHub Pages. This works for the frontend but you'll need a separate backend deployment.

## Setup Instructions

### 1. Prepare Repository
```bash
# Commit all deployment configurations
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### 2. Backend Environment Setup

Copy the production environment template:
```bash
cp .env.production.example backend/.env.production
```

Edit `backend/.env.production` with your production values.

### 3. Database Migration for Production

For production, you'll want to use PostgreSQL instead of SQLite:

1. Update `backend/database.py` to use PostgreSQL URL from environment
2. Install PostgreSQL adapter: `pip install psycopg2-binary`
3. Add to `backend/requirements.txt`

### 4. Frontend Configuration

Update the API URL in your production environment:
- For Vercel: Set `VITE_API_URL` environment variable
- For Netlify: Update `netlify.toml` with your backend URL
- For GitHub Pages: Create `.env.production` with your backend URL

## Automated Deployment

The included GitHub Actions workflows will automatically deploy when you push to the main branch:

- `deploy.yml`: Deploys to GitHub Pages
- `production.yml`: Deploys to Vercel and Netlify

To use automated deployment:

1. Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):
   ```
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_vercel_org_id
   VERCEL_PROJECT_ID=your_vercel_project_id
   NETLIFY_AUTH_TOKEN=your_netlify_token
   NETLIFY_SITE_ID=your_netlify_site_id
   ```

2. Push to main branch to trigger deployment

## Domain Setup (Optional)

1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. In Vercel/Netlify dashboard, add custom domain
3. Update DNS records as instructed by the platform
4. Update CORS settings in backend with new domain

## Monitoring and Maintenance

- Monitor application logs in Railway/Render dashboard
- Set up error tracking (Sentry.io)
- Enable analytics (Google Analytics, Plausible)
- Set up uptime monitoring (UptimeRobot)

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure backend ALLOWED_ORIGINS includes your frontend domain
2. **Database Errors**: Check DATABASE_URL format and credentials
3. **Build Failures**: Verify Node.js version matches local development
4. **API Connection**: Ensure VITE_API_URL points to correct backend domain

### Debug Steps:
1. Check platform logs (Vercel/Netlify/Railway dashboards)
2. Test API endpoints directly in browser
3. Verify environment variables are set correctly
4. Check network tab in browser dev tools

## Cost Estimates

### Free Tier Limits:
- **Vercel**: 100GB bandwidth, unlimited static sites
- **Netlify**: 100GB bandwidth, 300 build minutes
- **Railway**: $5/month after free trial, includes database
- **Render**: Free tier with limitations, paid plans start at $7/month

## Next Steps After Deployment

1. Set up custom domain
2. Configure SSL certificate (automatic on most platforms)
3. Add error monitoring and analytics
4. Set up automated backups for database
5. Implement monitoring and alerts
6. Configure CI/CD for automated testing

Choose the deployment option that best fits your needs and budget!