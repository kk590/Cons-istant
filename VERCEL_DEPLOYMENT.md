# Chronos Scheduler - Vercel Deployment Guide

Complete guide to deploy your executive scheduling platform to Vercel.

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free at vercel.com)
- Git installed on your computer
- Your domain (optional, Vercel provides free .vercel.app domain)

## 🚀 Quick Deployment (5 minutes)

### Step 1: Initialize Git Repository

```bash
# Create a new folder for your project
mkdir chronos-scheduler
cd chronos-scheduler

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Chronos scheduler"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/new)
2. Create new repository named `chronos-scheduler`
3. Copy the commands to push existing repository
4. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/chronos-scheduler.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

**Option A: Vercel Dashboard**

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `chronos-scheduler` repository
5. Click "Import"
6. In "Framework Preset" → Select "Other"
7. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### Step 4: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:

```
NEXT_PUBLIC_API_URL = https://your-api.com
PADDLE_VENDOR_ID = your-paddle-vendor-id
GOOGLE_CLIENT_ID = your-google-client-id
```

## 📁 Project Structure

```
chronos-scheduler/
├── index.html                    # Main booking page
├── package.json                  # Dependencies (Vercel uses this)
├── vercel.json                   # Vercel configuration
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
├── VERCEL_DEPLOYMENT.md          # This file
├── README.md                     # Project documentation
└── public/                       # (Optional) Static files
    ├── favicon.ico
    └── robots.txt
```

## 🌐 Custom Domain Setup

### Option 1: Using Vercel Domain (Recommended)

Your site is automatically deployed at:
```
https://chronos-scheduler.vercel.app
```

### Option 2: Using Custom Domain

1. In Vercel Dashboard → Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `scheduler.yoursite.com`)
4. Follow DNS configuration instructions
5. Update nameservers at your domain registrar

### Option 3: Using Subdomain

Example: `scheduler.chronos.app`

1. Add domain to Vercel
2. Update DNS at your registrar:
   - Add CNAME record: `scheduler` → `chronos-scheduler.vercel.app`

## 🔧 Environment Variables Setup

### Create `.env.local` (for local development)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
PADDLE_VENDOR_ID=your-paddle-vendor-id
GOOGLE_CLIENT_ID=your-google-client-id
```

### Set in Vercel Dashboard

1. Project Settings → Environment Variables
2. Add each variable for each environment:
   - Production
   - Preview
   - Development

**Important**: Prefix with `NEXT_PUBLIC_` to expose to frontend.

## 🔐 Security Best Practices

### ✅ DO:
- Use `NEXT_PUBLIC_` only for non-sensitive values
- Keep API keys in Vercel environment variables
- Use HTTPS (Vercel handles this automatically)
- Rotate secrets regularly
- Never commit `.env` files

### ❌ DON'T:
- Commit `.env` to GitHub
- Expose API keys in code
- Use `eval()` or dangerous functions
- Store passwords in plain text
- Disable HTTPS

## 🚀 Deployment Workflow

### Development
```bash
npm run dev
# Visit http://localhost:8000
```

### Testing
```bash
# Make changes locally
git add .
git commit -m "Feature description"
git push origin main
```

Vercel automatically deploys on push!

### Production
Same as testing - push to main branch and Vercel deploys.

## 🔄 Continuous Deployment

Vercel automatically deploys when you:
1. Push to `main` branch
2. Create pull request (preview deployment)
3. Merge pull request
4. Push to any branch (optional)

### Preview URLs

Each push creates a preview URL:
```
https://chronos-scheduler-git-branch-name.vercel.app
```

Perfect for testing before merging!

## 📊 Monitoring & Analytics

### View Deployment Logs

```bash
vercel logs
```

### Monitor Performance

In Vercel Dashboard:
- View real-time analytics
- Monitor build times
- Check uptime
- See error rates

### Check Health

```bash
https://your-deployment.vercel.app/
```

## 🐛 Troubleshooting

### Build Fails

**Issue**: "npm ERR! Cannot find module"

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

### Site Shows 404

**Issue**: Vercel can't find index.html

**Solution**:
1. Check file is in root directory
2. Verify filename is exactly `index.html`
3. Check vercel.json configuration

### Environment Variables Not Working

**Issue**: Variables show as undefined

**Solution**:
1. Use `NEXT_PUBLIC_` prefix for frontend variables
2. Redeploy after adding variables
3. Check dashboard vs code

### Custom Domain Not Working

**Issue**: DNS timeout or CNAME error

**Solution**:
1. Wait 24-48 hours for DNS propagation
2. Verify DNS settings at registrar
3. Check Vercel domain settings
4. Use DNS checker tool: https://mxtoolbox.com

## 📈 Performance Optimization

### Optimize Images

```html
<!-- Use WebP format -->
<img src="image.webp" alt="description">

<!-- Or use picture element -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="description">
</picture>
```

### Minimize CSS/JS

Already minified in production build.

### Enable Caching

```
Cache-Control: public, max-age=31536000
```

### Compress Responses

Vercel automatically gzips responses.

## 🔄 Updating Your Site

### Make Changes Locally

```bash
# Make changes to index.html
# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Update booking form"
git push origin main
```

### Vercel Deploys Automatically

1. GitHub receives push
2. Vercel webhook triggers
3. Vercel builds project
4. Site updates live

Takes 30-60 seconds total!

## 📱 Mobile Optimization

Your site is already responsive, but test on:

- iPhone (Safari)
- Android (Chrome)
- Tablet devices
- Desktop browsers

Use Chrome DevTools for testing:
```
DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

## 🔗 Connect to Backend API

Update your booking form to call backend:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function confirmBooking() {
    const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            meetingType: selectedMeetingType,
            date: selectedDate,
            time: selectedTime,
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value
        })
    });
    
    const data = await response.json();
    console.log('Booking created:', data);
}
```

## 🎯 Next Steps After Deployment

1. **Test Everything**
   - [ ] Booking flow works
   - [ ] Form validation works
   - [ ] Mobile responsive
   - [ ] All links work

2. **Configure Integrations**
   - [ ] Set up Paddle payments
   - [ ] Connect Google OAuth
   - [ ] Configure backend API

3. **Add Analytics**
   - [ ] Google Analytics
   - [ ] Sentry error tracking
   - [ ] Vercel analytics

4. **Security**
   - [ ] Enable HTTPS (automatic)
   - [ ] Set security headers
   - [ ] Configure CORS

5. **Marketing**
   - [ ] Add SEO meta tags
   - [ ] Create landing page
   - [ ] Share your booking link

## 📚 Useful Resources

- [Vercel Docs](https://vercel.com/docs)
- [Git Guide](https://git-scm.com/doc)
- [GitHub Help](https://docs.github.com)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains/add-a-domain)

## 💡 Pro Tips

### Tip 1: Preview Before Production

```bash
git checkout -b feature/new-form
# Make changes
git push origin feature/new-form
# Vercel creates preview URL
# Share with team for review
# Merge to main when ready
```

### Tip 2: Rollback Deployment

In Vercel Dashboard:
1. Go to Deployments
2. Click on previous deployment
3. Click "Promote to Production"

Instant rollback!

### Tip 3: Monitor with Alerts

Set up alerts in Vercel for:
- Build failures
- Deployment issues
- Performance degradation

### Tip 4: Use Vercel CLI for Everything

```bash
# Create project
vercel

# Deploy specific file
vercel --prod

# View logs
vercel logs

# Remove project
vercel remove
```

## 🎁 Bonus: CI/CD Pipeline

Your Vercel setup includes automatic CI/CD:

1. **Pull Request** → Preview deployment
2. **Code Review** → Test on preview
3. **Merge to Main** → Production deployment
4. **Rollback** → One-click revert

All automatic!

## 📞 Support

### Vercel Issues
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### GitHub Issues
- [GitHub Support](https://support.github.com)
- [GitHub Docs](https://docs.github.com)

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All files committed to GitHub
- [ ] Environment variables set in Vercel
- [ ] index.html tested locally
- [ ] Mobile responsiveness verified
- [ ] Links all working
- [ ] No console errors
- [ ] Custom domain configured (if applicable)
- [ ] Analytics set up
- [ ] Backend API connected
- [ ] Paddle/Google OAuth configured
- [ ] SSL certificate active
- [ ] Backups configured

## 🎉 You're Live!

Your Chronos Scheduler is now live on Vercel!

**Your URL**: `https://chronos-scheduler.vercel.app`

Share it with the world! 🚀

---

**Questions?** Check Vercel docs or ask for help!

**Last Updated**: January 2025
