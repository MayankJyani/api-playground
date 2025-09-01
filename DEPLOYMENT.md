# Deployment Instructions

## Quick Deploy Options

### Option 1: Render.com (Recommended)
1. Push this repository to GitHub
2. Connect GitHub repo to Render.com
3. Use the `backend/render.yaml` configuration
4. Deploy automatically

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. From the `backend` directory, run: `vercel`
3. Follow the prompts for deployment

### Option 3: Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. From the `backend` directory, run: `railway login`
3. Run: `railway up`

### Option 4: Heroku
1. Install Heroku CLI
2. From the `backend` directory:
   ```bash
   heroku create your-app-name
   git subtree push --prefix backend heroku master
   ```

## Frontend Deployment

Deploy the `frontend` folder to any static hosting service:
- **Netlify**: Drag & drop the frontend folder
- **Vercel**: Deploy frontend as a separate static site
- **GitHub Pages**: Push frontend to gh-pages branch
- **Surge.sh**: `npm i -g surge && surge frontend/`

## Environment Variables for Production

Set these environment variables on your hosting platform:
- `NODE_ENV=production`
- `PORT` (usually set automatically by hosting provider)

## Post-Deployment

1. Update `API_BASE_URL` in `frontend/app.js` to point to your deployed backend
2. Test all endpoints work correctly
3. Update README.md with live URLs

## Testing Deployment

After deployment, verify these endpoints work:
- `GET /health` → Should return 200 with status message
- `GET /profiles` → Should return array of seeded profiles
- `GET /profiles?skill=Python` → Should return filtered results
- `GET /search/projects?q=web` → Should return matching projects
