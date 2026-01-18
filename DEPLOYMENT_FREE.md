# 100% Free Deployment Guide

Deploy your Travel Planner completely free using:
- **Frontend**: Vercel (Free Forever)
- **Backend**: Render Free Tier
- **Database**: Neon PostgreSQL (Free Tier)

## Total Cost: $0/month 💰

---

## Prerequisites

- GitHub account (free)
- Vercel account (free)
- Render account (free)
- Neon account (free)
- OpenAI API key (if using LLM features - pay as you go)

---

## Part 1: Create Free PostgreSQL Database (Neon)

### Step 1: Sign Up for Neon

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (free)
3. Click **"Create a project"**
4. Name: `travelplanner-db`
5. Region: Choose closest to you
6. Click **"Create project"**

### Step 2: Get Database URL

1. In your Neon project dashboard, click **"Connection Details"**
2. Copy the **Connection string** (looks like):
   ```
   postgresql://neondb_owner:npg_sgUmD9yzn3GA@ep-jolly-dream-a1b9xbsp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
3. Save this for later!

**Free Tier Limits:**
- ✅ 512 MB storage (plenty for hobby projects)
- ✅ No credit card required
- ✅ Never expires
- ✅ SSL encryption included

---

## Part 2: Deploy Backend to Render (Free)

### Step 1: Push Code to GitHub

```bash
cd /Users/marcuslim/Desktop/travelplanner
git add .
git commit -m "Prepare for free deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Click **"Connect"** next to `travelplanner`

### Step 3: Configure Service

Fill in these settings:

- **Name:** `travelplanner-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** Leave blank (or put `/` if required)
- **Runtime:** `Python 3`
- **Build Command:**
  ```bash
  pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
  ```
- **Start Command:**
  ```bash
  gunicorn backend.wsgi:application
  ```
- **Instance Type:** **Free** ⭐

### Step 4: Add Environment Variables

Scroll down to **Environment Variables** and add:

```
DEBUG=False
SECRET_KEY=<generate-a-random-secret-key-here>
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-will-go-here.vercel.app
DATABASE_URL=<paste-your-neon-database-url-here>
OPENAI_API_KEY=<your-openai-key-if-you-have-one>
```

**Generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building (takes 5-10 minutes first time)
3. Watch the logs to ensure it deploys successfully
4. Your backend URL will be: `https://travelplanner-backend.onrender.com`

**Free Tier Limits:**
- ✅ 750 hours/month (enough to run 24/7)
- ✅ No credit card required
- ⚠️ Spins down after 15 min of inactivity (first request takes 30-60 seconds to wake up)
- ✅ 512 MB RAM
- ✅ Automatic SSL certificate

---

## Part 3: Deploy Frontend to Vercel (Free)

### Step 1: Update Frontend Environment

Create frontend environment file:

```bash
cd /Users/marcuslim/Desktop/travelplanner/frontend
echo "VITE_API_URL=https://travelplanner-backend.onrender.com" > .env.production.local
```

Replace `travelplanner-backend.onrender.com` with your actual Render URL.

### Step 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from frontend directory
cd /Users/marcuslim/Desktop/travelplanner/frontend
vercel
```

Answer the prompts:
- Set up and deploy? → **Y**
- Which scope? → (select your account)
- Link to existing project? → **N**
- What's your project's name? → **travelplanner-frontend**
- In which directory is your code located? → **`./`** (just press Enter)
- Want to override the settings? → **N**

### Step 3: Add Environment Variable

```bash
vercel env add VITE_API_URL production
```

When prompted, enter: `https://travelplanner-backend.onrender.com`

### Step 4: Deploy to Production

```bash
vercel --prod
```

Your frontend URL will be: `https://travelplanner-frontend.vercel.app`

**Free Tier Limits:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ No credit card required
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Always fast (no spin-down)

---

## Part 4: Update Backend CORS

Now that you have your Vercel URL, update it in Render:

1. Go to Render dashboard → Your web service
2. Go to **Environment** tab
3. Update `CORS_ALLOWED_ORIGINS` to:
   ```
   https://travelplanner-frontend.vercel.app,https://travelplanner-frontend-git-main-yourusername.vercel.app
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

## Alternative Free Option: Koyeb

If Render's spin-down time bothers you, try Koyeb:

### Koyeb (Backend Alternative)

1. Go to [koyeb.com](https://koyeb.com)
2. Sign up (free, no credit card)
3. Click **"Create App"**
4. Connect GitHub repo
5. Configure:
   - **Build command:** `pip install -r requirements.txt`
   - **Run command:** `gunicorn backend.wsgi:application`
6. Add same environment variables as Render

**Koyeb Free Tier:**
- ✅ 512 MB RAM
- ✅ No spin-down (stays awake!)
- ✅ Faster cold starts than Render

---

## Testing Your Deployment

### 1. Test Backend API

Visit in browser:
```
https://travelplanner-backend.onrender.com/api/trips/
```

Should return: `[]` (empty list) or your trips

### 2. Test Frontend

Visit:
```
https://travelplanner-frontend.vercel.app
```

Should load your app successfully!

### 3. Test Full Functionality

1. Create a new trip
2. Add itinerary items
3. Add expenses
4. Check browser console for errors

---

## Important Notes About Free Tiers

### ⚠️ Render Free Tier Limitations

**Spin-down behavior:**
- After 15 minutes of no requests, the backend goes to sleep
- First request after sleep takes 30-60 seconds to wake up
- Subsequent requests are fast

**User experience tip:**
Add a loading state in your frontend that says:
> "Loading... The server may take up to 60 seconds to start if it hasn't been used recently (free tier limitation)."

### 💡 Optional: Keep Backend Awake

Use a free service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 14 minutes:

1. Sign up at uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: `https://your-backend.onrender.com/api/trips/`
4. Monitoring Interval: 5 minutes
5. This keeps your backend awake during active hours

---

## Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| Neon PostgreSQL | **$0** | 512 MB, unlimited time |
| Render Backend | **$0** | 750 hrs/month, spins down after 15 min |
| Vercel Frontend | **$0** | 100 GB bandwidth, unlimited projects |
| **TOTAL** | **$0/month** | ✅ Perfect for portfolio/hobby projects |

---

## When to Upgrade to Paid

Consider paying when:
- You have consistent traffic (to avoid spin-down)
- You need more than 512 MB database storage
- You want better performance
- You're making money from the app

**Upgrade costs:**
- Render: $7/month (no spin-down, better performance)
- Neon: $19/month (3 GB storage)
- Vercel: Stay free for frontend!

---

## Troubleshooting Free Deployment

### Backend Takes Forever to Load

**Normal!** Render free tier spins down after 15 min of inactivity.

**Solutions:**
1. Add loading message to frontend
2. Use UptimeRobot to keep it awake
3. Upgrade to Render paid ($7/month)

### "502 Bad Gateway" Error

Backend is starting up. Wait 30-60 seconds and refresh.

### CORS Errors

Check your `CORS_ALLOWED_ORIGINS` includes:
- Your main Vercel URL
- Your git branch URLs (Vercel creates preview URLs)

Example:
```
https://app.vercel.app,https://app-git-main-user.vercel.app,https://app-user.vercel.app
```

### Database Connection Errors

Verify Neon `DATABASE_URL` in Render environment variables:
- Must include `?sslmode=require` at the end
- Must be the full connection string

### Out of Database Storage

Free Neon tier has 512 MB. To check usage:
1. Go to Neon dashboard
2. Check storage metrics
3. Delete old test data if needed

---

## Monitoring Your Free Services

### Check Render Logs

1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. See real-time logs and errors

### Check Vercel Deployments

1. Go to Vercel dashboard
2. Click your project
3. See deployment history and logs

### Check Neon Database

1. Go to Neon dashboard
2. See storage usage and connection stats
3. SQL Editor to run queries directly

---

## Making Updates

### Update Frontend

```bash
cd /Users/marcuslim/Desktop/travelplanner/frontend
git pull origin main
vercel --prod
```

### Update Backend

```bash
cd /Users/marcuslim/Desktop/travelplanner
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys!
```

---

## Summary: Your Free Stack 🎉

✅ **Frontend:** Vercel (always fast, global CDN)  
✅ **Backend:** Render (free, but spins down)  
✅ **Database:** Neon PostgreSQL (512 MB)  
✅ **SSL:** Free on all services  
✅ **Total Cost:** $0/month  

**Perfect for:**
- Portfolio projects
- Learning/practice
- Low-traffic apps
- Prototypes and demos

**Limitations:**
- Backend cold starts (30-60s after 15 min inactivity)
- 512 MB database storage
- Basic support only

**This is completely free and will stay free forever!** 🚀

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Issues? Check your service logs first!

Happy deploying! 🎊
