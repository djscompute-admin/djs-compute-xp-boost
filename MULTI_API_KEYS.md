# Multiple API Keys Setup Guide

## 🎯 Why Use Multiple API Keys?

Each Google API key has a quota limit:
- **Free tier**: 300-500 requests per minute per key
- **With multiple keys**: Multiply your capacity

For 160 users with 10-second polling:
- Single key: ~50 concurrent users max
- 2 keys: ~100 concurrent users ✅
- 3 keys: ~150 concurrent users ✅

## 🔑 How It Works

The frontend automatically:
1. Tries the first API key
2. If rate limited (429 error), tries the next key
3. Continues until one works
4. Logs which key succeeded (for monitoring)

**Backend stays the same** - Uses service account (unlimited quota)

---

## 📝 Setup Instructions

### Step 1: Create Additional API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Click **"Create Credentials" → "API Key"** (repeat 2-3 times)
4. You'll now have multiple API keys

**Example:**
```
Key 1: AIzaSyD-abc123...
Key 2: AIzaSyD-def456...
Key 3: AIzaSyD-ghi789...
```

### Step 2: Restrict Each API Key (Important!)

For **each** API key, click to edit and configure:

**Application restrictions:**
- Select "HTTP referrers (websites)"
- Add your domains:
  - `https://yourdomain.com/*`
  - `https://*.vercel.app/*`
  - For local dev temporarily: `http://localhost:3000/*`

**API restrictions:**
- Select "Restrict key"
- Choose **only** "Google Sheets API"

**Important**: All keys should have the same restrictions!

### Step 3: Configure Environment Variables

**For Local Development** - Edit `.env.local`:
```env
NEXT_PUBLIC_SPREADSHEET_ID=18RRVK9JJ__Ybdku1XNY5WodzppT0SeoI2op4I8e_Ls0
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyD-key1,AIzaSyD-key2,AIzaSyD-key3
```

**Format**: Separate keys with commas (no spaces)

**For Production (Vercel)**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add variable: `NEXT_PUBLIC_GOOGLE_API_KEY`
3. Value: `AIzaSyD-key1,AIzaSyD-key2,AIzaSyD-key3`

### Step 4: Test Configuration

Run the test script:
```bash
# Update test-api.js with your keys (comma-separated)
node test-api.js
```

Or test with multiple browser tabs:
```bash
npm run dev
# Open 10+ tabs with your site
# Check console - should see no rate limit errors
```

---

## 📊 Capacity Planning

### Single API Key (500 req/min limit):
```
10-second polling: 6 requests/min per user
Capacity: ~80 concurrent users
```

### Two API Keys (1000 req/min total):
```
10-second polling: 6 requests/min per user
Capacity: ~160 concurrent users ✅
```

### Three API Keys (1500 req/min total):
```
10-second polling: 6 requests/min per user
Capacity: ~250 concurrent users ✅✅
```

---

## 🧪 Testing Multiple Keys

### Test Script

Create `test-multi-keys.js`:
```javascript
const API_KEYS = [
  'AIzaSyD-key1',
  'AIzaSyD-key2',
  'AIzaSyD-key3'
];

async function testAllKeys() {
  for (let i = 0; i < API_KEYS.length; i++) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A:C?key=${API_KEYS[i]}`;
    
    try {
      const response = await fetch(url);
      console.log(`Key ${i + 1}: ${response.status} ${response.statusText}`);
    } catch (e) {
      console.error(`Key ${i + 1}: Error - ${e.message}`);
    }
  }
}

testAllKeys();
```

Run:
```bash
node test-multi-keys.js
```

Expected output:
```
Key 1: 200 OK ✅
Key 2: 200 OK ✅
Key 3: 200 OK ✅
```

---

## 🎯 Recommended Setup for Your Event

### For 160 Participants:

**Option A: 2 API Keys + 20s polling** (Most reliable)
```env
NEXT_PUBLIC_GOOGLE_API_KEY=key1,key2
```
In `Leaderboard.js`:
```javascript
const REFRESH_INTERVAL = 20 * 1000; // 20 seconds
```

**Capacity**: 200 concurrent users
**Safety margin**: 25% buffer

---

**Option B: 3 API Keys + 10s polling** (Best experience)
```env
NEXT_PUBLIC_GOOGLE_API_KEY=key1,key2,key3
```
In `Leaderboard.js`:
```javascript
const REFRESH_INTERVAL = 10 * 1000; // 10 seconds
```

**Capacity**: 250 concurrent users
**Safety margin**: 56% buffer

---

## 🔍 Monitoring During Event

### Check Browser Console

Users won't see errors, but you can monitor:
```
// When primary key works (no logs)
// When fallback key is used:
"Successfully fetched data using API key 2"
```

### Google Cloud Console

Monitor all keys:
1. Go to APIs & Services → Dashboard
2. Select Google Sheets API
3. Check "Requests" graph
4. See which keys are being used

---

## 🚨 Troubleshooting

### "All API keys failed"

**Causes:**
- All keys hit rate limit simultaneously
- Network issue
- API keys not configured correctly

**Solutions:**
1. Increase `REFRESH_INTERVAL` to 20-30 seconds
2. Add more API keys
3. Request quota increase for all keys

### "API key 2 rate limited, trying next key..."

**This is normal!** The system is working as designed.
- First key hit limit
- Automatically switched to second key
- No user impact ✅

### Keys not being used evenly

**This is expected** - Keys are tried in order, not load-balanced.
- Key 1 gets most traffic
- Key 2 used when Key 1 is limited
- Key 3 used when Keys 1 & 2 are limited

**This is fine** - The fallback system works perfectly for burst traffic.

---

## 💡 Advanced: Load Balancing (Optional)

Want to distribute load evenly across all keys?

Add this to `Leaderboard.js`:
```javascript
// Round-robin API key selection
let currentKeyIndex = 0;

const getNextApiKey = () => {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
};

// In fetchLeaderboardData, use:
const apiKey = getNextApiKey();
```

**Benefits**:
- Distributes load evenly
- Each key handles ~33% of requests (with 3 keys)

**Drawbacks**:
- More complex
- May hit limits on multiple keys
- Not necessary for your use case

---

## ✅ Quick Setup Checklist

For your event, do this:

- [ ] Create 2-3 API keys in Google Cloud Console
- [ ] Restrict each key (HTTP referrers + Google Sheets API only)
- [ ] Update `.env.local` with comma-separated keys
- [ ] Test with `node test-api.js`
- [ ] Deploy to Vercel with updated environment variable
- [ ] Verify in browser console during testing
- [ ] Monitor during event

---

## 📊 Cost Analysis

**All API keys are FREE** ✅

- No additional cost for multiple keys
- All stay within free tier
- Better than requesting quota increase (which may require billing)

**Recommended for:**
- Events with 100+ users
- Peak traffic scenarios
- Better reliability/redundancy

---

## 🎉 Summary

**With 2-3 API keys, you can:**
- ✅ Support 160+ concurrent users easily
- ✅ Keep 10-second polling for real-time feel
- ✅ Auto-fallback if one key hits limit
- ✅ No backend changes needed
- ✅ Zero additional cost
- ✅ Better user experience

**Your backend (Streamlit) stays the same** - Uses service account with unlimited quota.

**This is a production-ready solution!** 🚀
