# Frontend Setup Guide - XP Boost Leaderboard

This guide will help you set up the frontend to use Google Sheets API for real-time leaderboard updates.

## 🎯 What You'll Achieve

- **Update time**: 2 minutes → 10 seconds
- **Direct API access**: Bypass CSV publication delay
- **Real-time updates**: Changes appear within polling interval
- **Works everywhere**: Local development and production deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- Google Cloud Project (same one used for backend)
- Google Sheets API enabled

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

Current dependencies (already in package.json):
- Next.js 16.0.1
- React 19.2.0
- Other UI libraries

**No additional packages needed!** - Google Sheets API uses standard fetch.

### Step 2: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (same one used for backend)
3. Go to **"APIs & Services"** → **"Library"**
4. Search for **"Google Sheets API"**
5. Click **"Enable"** (if not already enabled)

### Step 3: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. A new API key will be created - **Copy it immediately!**

### Step 4: Restrict API Key (IMPORTANT for Security)

After creating the API key:

1. Click on the API key to edit it
2. Under **"Application restrictions"**:
   - For **local development**: Select "None" (we'll restrict it later)
   - For **production**: Select "HTTP referrers (websites)"
     - Add your domain: `https://yourdomain.com/*`
     - Add vercel domain: `https://*.vercel.app/*` (if using Vercel)

3. Under **"API restrictions"**:
   - Select "Restrict key"
   - Choose **"Google Sheets API"** only
   - This ensures the key can ONLY read Google Sheets

4. Click **"Save"**

### Step 5: Make Sheet Publicly Readable

Your Google Sheet needs to be readable by anyone with the link:

1. Open your Google Sheet
2. Click **"Share"** button
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

⚠️ **Note**: This makes the sheet publicly readable. Don't put sensitive data in it!

### Step 6: Get Your Spreadsheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1a2BcD3EfG4HiJ5kL6mN7oP8qR9sT0uVwXyZ/edit
                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                    This is your Spreadsheet ID
```

### Step 7: Configure Environment Variables

1. Copy the example file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Edit `.env.local` and add your values:
   ```env
   NEXT_PUBLIC_SPREADSHEET_ID=your_actual_spreadsheet_id
   NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyD-your_actual_api_key
   ```

3. **Verify your sheet name**: If your sheet tab is not named "Sheet1", update line 8 in `app/components/Leaderboard.js`:
   ```javascript
   const SHEET_NAME = 'YourSheetName'; // Change to your actual sheet tab name
   ```

### Step 8: Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Step 9: Verify It's Working

1. Open `http://localhost:3000` in your browser
2. The leaderboard should load within a few seconds
3. Open browser console (F12) - you should NOT see errors
4. Update a team's XP in the Streamlit admin panel
5. The leaderboard should update within 10 seconds

## 🚀 Deployment

### For Vercel (Recommended)

1. Push your code to GitHub (`.env.local` is git-ignored ✅)

2. Import project in Vercel

3. Add environment variables in Vercel dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add `NEXT_PUBLIC_SPREADSHEET_ID`
   - Add `NEXT_PUBLIC_GOOGLE_API_KEY`

4. Deploy!

5. **Update API Key restrictions**:
   - Go back to Google Cloud Console
   - Edit your API key
   - Add your Vercel domain to HTTP referrers:
     - `https://your-project.vercel.app/*`
     - `https://*.vercel.app/*` (for preview deployments)

### For Other Platforms (Netlify, AWS, etc.)

1. Deploy as usual
2. Add environment variables in platform settings
3. Update API key restrictions with your domain

## 🔒 Security Considerations

### Is it safe to use API Key in frontend?

✅ **YES**, when properly configured:

1. **API Key is restricted**:
   - Only works on your domain (HTTP referrers)
   - Only has Google Sheets API access (read-only)
   - Can't write or modify data

2. **Sheet is public anyway**:
   - Leaderboard is meant to be public
   - API key only reads what's already publicly visible

3. **Write access is separate**:
   - Admin panel uses service account (more secure)
   - Only you can update through Streamlit

### Environment Variable Naming

- `NEXT_PUBLIC_*` prefix makes variables available in browser
- This is intentional - we need it for client-side API calls
- Never add sensitive write credentials with this prefix

## 📊 API Quota & Limits

### Free Tier Limits (per project):
- **500 requests per 100 seconds** per user
- **Unlimited daily quota** (with rate limiting)

### Your Usage:
- Polling every 10 seconds = 6 requests/minute per user
- Can handle **~80 concurrent users** comfortably
- If you exceed, increase `REFRESH_INTERVAL` in Leaderboard.js

### If You Need More:
1. Increase polling interval to 15-20 seconds
2. Request quota increase in Google Cloud Console (usually approved)
3. Implement caching layer (Next.js API route)

## 🐛 Troubleshooting

### "Failed to load leaderboard data"

**Check browser console for specific error:**

1. **Missing environment variables**:
   ```
   Error: Missing environment variables
   ```
   - Verify `.env.local` exists
   - Check variable names match exactly (with `NEXT_PUBLIC_` prefix)
   - Restart dev server after adding env vars

2. **403 Forbidden**:
   ```
   HTTP error! status: 403
   ```
   - API key restrictions are too strict
   - For local dev, temporarily remove HTTP referrer restrictions
   - Ensure Google Sheets API is enabled

3. **404 Not Found**:
   ```
   HTTP error! status: 404
   ```
   - Wrong Spreadsheet ID
   - Sheet is not publicly readable (change share settings)

4. **400 Bad Request**:
   ```
   HTTP error! status: 400
   ```
   - Invalid API key
   - Check for extra spaces in `.env.local`
   - Verify sheet name matches in code

### Sheet Updates Not Appearing

1. **Check polling interval**: Default is 10 seconds
2. **Verify Streamlit is working**: Update should save to sheet
3. **Check browser cache**: Hard refresh (Ctrl+Shift+R)
4. **Monitor API calls**: Open Network tab in browser DevTools

### Slow Loading

1. **First load**: Might take 2-3 seconds (normal)
2. **Subsequent updates**: Should be within polling interval
3. **If consistently slow**: Check your internet connection

### Development Server Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Or on Windows:
rmdir /s .next
npm run dev
```

## 📁 File Structure

```
Compute Website/
├── app/
│   ├── components/
│   │   └── Leaderboard.js          # Updated to use Google Sheets API
│   └── ...
├── backend/                         # Streamlit admin panel
├── .env.local                       # Your environment variables (git-ignored)
├── .env.local.example              # Template for environment variables
├── package.json                     # Dependencies
└── FRONTEND_SETUP.md               # This file
```

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Flow Diagram                        │
└─────────────────────────────────────────────────────────────┘

Admin (You)
    ↓
Streamlit Panel (localhost:8501)
    ↓ [Writes via Service Account]
Google Sheet (single source of truth)
    ↓ [Reads via API Key]
Frontend (polls every 10s)
    ↓
User sees update within 10 seconds!
```

### Key Differences from CSV Approach:

| Aspect | Old (CSV) | New (API) |
|--------|-----------|-----------|
| Data source | Published CSV endpoint | Direct Sheets API |
| Update delay | ~2 minutes (publication lag) | ~0 seconds |
| Total time | 2+ minutes | 10 seconds |
| Data format | CSV text | JSON |
| Parsing | Manual string split | Native JSON parse |
| Reliability | Medium | High |

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

## 💡 Tips

1. **Keep API key secret**: Don't commit `.env.local` to Git
2. **Monitor usage**: Check Google Cloud Console quota page
3. **Test locally first**: Verify everything works before deploying
4. **Use preview deployments**: Test on Vercel preview before production
5. **Set up monitoring**: Use Vercel Analytics or similar

## 🎨 Customization

### Change Polling Interval

In `Leaderboard.js`:
```javascript
const REFRESH_INTERVAL = 15 * 1000; // 15 seconds instead of 10
```

### Change Sheet Range

If your data is in different columns:
```javascript
const RANGE = `${SHEET_NAME}!A:D`; // Include column D
```

### Add Caching

For production optimization, create `app/api/leaderboard/route.js`:
```javascript
export async function GET() {
  // Fetch from Google Sheets
  // Cache for 5 seconds
  // Return to frontend
}
```

Then update `Leaderboard.js` to fetch from `/api/leaderboard` instead.

## ✅ Checklist

Before deploying, ensure:

- [ ] Google Sheets API is enabled
- [ ] API key is created and restricted
- [ ] Sheet is publicly readable (Viewer access)
- [ ] Environment variables are set
- [ ] Local development works
- [ ] Updates appear within 10 seconds
- [ ] No console errors
- [ ] Deployment environment variables are configured
- [ ] API key restrictions include production domain

## 🆘 Need Help?

If you're stuck:
1. Check browser console for errors
2. Verify all environment variables
3. Test API endpoint directly in browser:
   ```
   https://sheets.googleapis.com/v4/spreadsheets/YOUR_ID/values/Sheet1!A:C?key=YOUR_KEY
   ```
4. Ensure sheet is publicly accessible

---

**You're all set!** 🎉 The leaderboard now updates in real-time via Google Sheets API.
