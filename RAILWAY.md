# School Management API - Railway.app Deployment Guide

## Deploy to Railway.app

### Step 1: Push to GitHub

Railway deploys from GitHub, so first push your code:

```bash
git add .
git commit -m "Add Railway configuration"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select this repository
5. Railway will auto-detect the Dockerfile and start building

### Step 3: Add MySQL Plugin

1. In your Railway project dashboard, click "New"
2. Select "MySQL" from the marketplace
3. Railway will automatically:
   - Create a MySQL database
   - Generate connection credentials
   - Set environment variables in your app

### Step 4: Configure Environment Variables

Railway **automatically provides these** from the MySQL plugin:
- `MYSQLHOST` 
- `MYSQLUSER` 
- `MYSQLPASSWORD` 
- `MYSQLDATABASE`

**Your app is now configured to read these automatically!** 

You don't need to manually map variables. The app (`app.js`) now reads both:
- **Local/Docker**: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- **Railway**: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`

### Step 5: Deploy

Click "Deploy" and Railway will:
1. Build the Docker image
2. Start your app
3. Connect to MySQL
4. Expose it on a public URL

## Troubleshooting

### App crashes after deployment
- Check Railway logs for error messages
- Verify MySQL plugin is added and running
- Ensure your code was pushed to GitHub

### "Missing required database configuration"
- Railway hasn't started the MySQL plugin yet
- Wait 30-60 seconds for the MySQL service to initialize
- Check the MySQL service status in Railway dashboard

### Connection refused / cannot reach database
- Check that MySQL service is "Running" in Railway dashboard
- View MySQL service logs for connection errors
- Try redeploying the app

## API Endpoints

Your app will be available at: `https://[your-project]-production.up.railway.app`

- `POST https://[your-url]/addSchool` - Add a school
- `GET https://[your-url]/listSchools?latitude=X&longitude=Y` - List schools by distance

## Files Used by Railway

- ✅ **Dockerfile** - Builds your app image
- ✅ **package.json** - Installs dependencies
- ✅ **app.js** - Your Express server
- ❌ **docker-compose.yml** - NOT used (Railway manages containers)
- ❌ **.env** - NOT used (Railway uses dashboard variables)

