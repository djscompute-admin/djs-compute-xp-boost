# Deployment Guide - Production Ready

## ✅ Pre-Deployment Checklist

### Google Cloud Setup
- [ ] Google Sheets API is enabled
- [ ] API Key is created
- [ ] API Key has Google Sheets API restriction
- [ ] Google Sheet is publicly readable (Viewer access)
- [ ] Service account has Editor access (for Streamlit backend)

### Local Testing
- [ ] `.env.local` is configured with correct values
- [ ] Local development server runs without errors (`npm run dev`)
- [ ] Leaderboard loads and displays data
- [ ] Updates from Streamlit appear within 10 seconds
- [ ] No console errors in browser DevTools
- [ ] Tested with multiple teams

### Code Review
- [ ] `.env.local` is in `.gitignore` (already done ✅)
- [ ] `service_account.json` is in `.gitignore` (already done ✅)
- [ ] No hardcoded credentials in code
- [ ] Sheet name in code matches actual sheet tab name

## 🚀 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Built for Next.js (zero config)
- Free tier available
- Automatic HTTPS
- Preview deployments
- Edge network (fast globally)

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Google Sheets API integration"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SPREADSHEET_ID` = `your_spreadsheet_id`
     - `NEXT_PUBLIC_GOOGLE_API_KEY` = `your_api_key`
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your site is live!

5. **Update API Key Restrictions**
   - Go to Google Cloud Console
   - Edit your API key
   - Under "Application restrictions" → "HTTP referrers"
   - Add:
     - `https://your-project.vercel.app/*`
     - `https://*.vercel.app/*` (for preview deployments)
   - Save

6. **Test Production**
   - Visit your Vercel URL
   - Check leaderboard loads
   - Update XP in Streamlit
   - Verify updates appear within 10 seconds

**Vercel URLs:**
- Production: `https://your-project.vercel.app`
- Previews: `https://your-project-git-branch.vercel.app`

---

### Option 2: Netlify

**Steps:**

1. **Push to GitHub** (same as above)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

4. **Environment Variables**
   - Site settings → Environment variables
   - Add both variables (same as Vercel)

5. **Update API Key Restrictions**
   - Add Netlify domain to Google Cloud Console
   - `https://your-site.netlify.app/*`

---

### Option 3: Custom Server (VPS/AWS/Azure)

**Requirements:**
- Node.js 18+ installed
- Process manager (PM2 recommended)
- Reverse proxy (Nginx/Apache)
- SSL certificate (Let's Encrypt)

**Steps:**

1. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd compute-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Production .env**
   ```bash
   nano .env.local
   # Add your credentials
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "xp-boost" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔒 Security Best Practices

### API Key Protection

1. **Always use restrictions**:
   - HTTP referrers for production domains
   - API restrictions to Google Sheets only

2. **Rotate keys periodically**:
   - Create new API key every 6-12 months
   - Delete old keys after migration

3. **Monitor usage**:
   - Check Google Cloud Console → APIs & Services → Metrics
   - Set up alerts for unusual activity

### Environment Variables

- ✅ Never commit `.env.local` to Git
- ✅ Use different API keys for dev/staging/prod
- ✅ Document required variables in `.env.local.example`
- ✅ Use platform-specific secrets management (Vercel/Netlify)

### Sheet Access

- ✅ Keep sheet publicly readable (required for API)
- ✅ Don't put sensitive data in the sheet
- ✅ Service account has Editor access (for Streamlit only)
- ✅ API key has read-only access

---

## 📊 Monitoring & Performance

### What to Monitor

1. **API Quota Usage**
   - Check Google Cloud Console daily
   - Monitor for quota warnings
   - Typical usage: 6 requests/min/user

2. **Error Rates**
   - Use Vercel Analytics
   - Monitor console errors
   - Set up error tracking (Sentry optional)

3. **Load Times**
   - First load: <3 seconds
   - Updates: <1 second
   - Use Lighthouse for performance audits

### Performance Optimization

1. **Increase polling if needed**:
   ```javascript
   const REFRESH_INTERVAL = 15 * 1000; // 15 seconds instead of 10
   ```

2. **Add caching layer** (optional):
   - Create Next.js API route
   - Cache Google Sheets response for 5-10 seconds
   - Reduces direct API calls

3. **Enable Next.js production optimizations**:
   - Already enabled by default ✅
   - Image optimization
   - Code splitting
   - Compression

---

## 🐛 Troubleshooting Production Issues

### Issue: "Failed to load leaderboard"

**Check:**
1. Environment variables in deployment platform
2. API key restrictions include your domain
3. Sheet is publicly readable
4. Check deployment logs for errors

### Issue: 403 Forbidden

**Solution:**
- API key restrictions are blocking your domain
- Add production domain to HTTP referrers
- Wait 5 minutes for changes to propagate

### Issue: Updates are slow

**Check:**
1. Streamlit backend is updating the sheet correctly
2. Polling interval in frontend
3. Network tab in DevTools shows API calls every 10s
4. Google Sheets API is responding quickly

### Issue: High API usage

**Solutions:**
1. Increase `REFRESH_INTERVAL`
2. Implement caching
3. Request quota increase from Google

---

## 🔄 Continuous Deployment

### Automatic Deployments (Vercel/Netlify)

Every push to `main` triggers:
1. Build
2. Deploy
3. Run checks
4. Go live automatically

### Recommended Workflow

1. **Development**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   npm run dev # Test locally
   git commit -m "Add feature"
   git push origin feature/new-feature
   ```

2. **Preview Deployment**:
   - Vercel/Netlify creates preview URL
   - Test on preview URL
   - Share with team for review

3. **Production**:
   ```bash
   git checkout main
   git merge feature/new-feature
   git push origin main
   ```
   - Automatic deployment to production

---

## 📱 Multi-Environment Setup

### Development
```env
# .env.local (local machine)
NEXT_PUBLIC_SPREADSHEET_ID=dev_sheet_id
NEXT_PUBLIC_GOOGLE_API_KEY=dev_api_key
```

### Staging
```env
# Vercel/Netlify staging environment
NEXT_PUBLIC_SPREADSHEET_ID=staging_sheet_id
NEXT_PUBLIC_GOOGLE_API_KEY=staging_api_key
```

### Production
```env
# Vercel/Netlify production environment
NEXT_PUBLIC_SPREADSHEET_ID=prod_sheet_id
NEXT_PUBLIC_GOOGLE_API_KEY=prod_api_key
```

---

## ✅ Post-Deployment Verification

1. **Functionality**:
   - [ ] Leaderboard loads without errors
   - [ ] All teams are displayed
   - [ ] Sorting by XP works correctly
   - [ ] Trophy icons display

2. **Real-time Updates**:
   - [ ] Update a team in Streamlit
   - [ ] See update within 10 seconds
   - [ ] No page refresh needed

3. **Performance**:
   - [ ] Page loads in <3 seconds
   - [ ] No console errors
   - [ ] Mobile responsive
   - [ ] Works on all browsers

4. **Monitoring**:
   - [ ] Analytics tracking works
   - [ ] Error logging configured
   - [ ] API quota monitoring active

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Leaderboard displays correctly on production URL
✅ Updates from Streamlit appear within 10 seconds
✅ No errors in browser console
✅ API key is properly restricted
✅ Environment variables are secure
✅ Performance meets expectations (<3s load time)
✅ Works on mobile and desktop
✅ Team can access and use Streamlit admin panel

---

## 📞 Support Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Google Sheets API**: [developers.google.com/sheets](https://developers.google.com/sheets/api)
- **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)

---

**Ready to deploy?** Follow the checklist above and you'll be live in minutes! 🚀
