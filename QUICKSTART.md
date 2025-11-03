# Quick Start Guide - Local Development

## 📦 Install Dependencies

```bash
npm install
```

## 🔑 Setup Environment Variables

1. Copy the example file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Get your Google API credentials (detailed instructions in `FRONTEND_SETUP.md`)

3. Edit `.env.local` with your actual values:
   ```
   NEXT_PUBLIC_SPREADSHEET_ID=your_spreadsheet_id
   NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key
   ```

## 🚀 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Quick Test

1. Visit the leaderboard page
2. Update a team's XP in the Streamlit admin panel (backend)
3. Wait ~10 seconds
4. See the leaderboard update automatically!

## 📚 Full Documentation

- **Frontend Setup**: See `FRONTEND_SETUP.md` for complete Google Sheets API setup
- **Backend Setup**: See `backend/README.md` for Streamlit admin panel setup

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Compute Website/
├── app/
│   ├── components/
│   │   └── Leaderboard.js       # Google Sheets API integration
│   ├── page.js
│   └── layout.js
├── backend/                      # Streamlit admin panel
├── public/                       # Static assets
├── .env.local                    # Your credentials (git-ignored)
└── package.json
```

## 🔄 Current Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **Backend**: Python + Streamlit
- **Data Source**: Google Sheets API
- **Update Time**: ~10 seconds (was 2 minutes with CSV)

---

**Need detailed setup instructions?** Read `FRONTEND_SETUP.md`
