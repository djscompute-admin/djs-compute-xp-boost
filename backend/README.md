# XP Boost Admin Panel - Backend

A Streamlit-based admin panel for managing the XP Boost leaderboard in real-time using Google Sheets API.

## 🚀 Features

- **Real-time Updates**: Changes are instantly reflected in Google Sheets
- **Two Update Modes**:
  - **Add XP**: Increment/decrement XP for a team
  - **Set XP**: Set absolute XP value for a team
- **Live Leaderboard View**: See current standings sorted by XP
- **Simple UI**: Clean, intuitive interface built with Streamlit
- **Secure**: Uses service account authentication

## 📋 Prerequisites

- Python 3.8 or higher
- Google Cloud Project with Sheets API enabled
- Service Account credentials

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in the details:
   - Service account name: `xp-boost-admin` (or any name)
   - Service account ID: Will be auto-generated
   - Click "Create and Continue"
4. Skip the optional steps and click "Done"

### Step 4: Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose **JSON** format
5. Click "Create" - This will download `service_account.json`
6. **Move this file to the `backend` folder**

⚠️ **IMPORTANT**: Never commit `service_account.json` to Git! It's already in `.gitignore`.

### Step 5: Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Copy the email from `service_account.json` (looks like: `xp-boost-admin@project-id.iam.gserviceaccount.com`)
4. Paste it in the share dialog
5. Give "Editor" permissions
6. Uncheck "Notify people" (it's a service account, not a real person)
7. Click "Share"

### Step 6: Configure Environment

1. Copy the example env file:
   ```bash
   copy .env.example .env
   ```

2. Get your Spreadsheet ID:
   - Open your Google Sheet
   - Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
   - Copy the `YOUR_SPREADSHEET_ID` part

3. Edit `.env` and add your Spreadsheet ID:
   ```
   SPREADSHEET_ID=your_actual_spreadsheet_id
   ```

### Step 7: Verify Sheet Format

Ensure your Google Sheet has these exact column headers in Row 1:
- Column A: `Team ID`
- Column B: `Team Name`
- Column C: `Total XP`

## 🎯 Running the App

### Local Development

```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

### Running with Custom Port

```bash
streamlit run app.py --server.port 8502
```

## 📖 How to Use

1. **Launch the app** using the command above
2. **Enter Spreadsheet ID** in the sidebar (or it will load from `.env`)
3. **View Leaderboard**: Current standings are displayed at the top
4. **Update XP**:
   - **Left Column (Add XP)**: Select team → Enter XP to add (can be negative) → Click "Add XP"
   - **Right Column (Set XP)**: Select team → Enter new total XP → Click "Set XP"
5. **Changes are instant**: The Google Sheet updates immediately

## 🔒 Security Best Practices

1. **Never commit** `service_account.json` or `.env` files
2. **Limit access** to the Google Sheet (only share with service account and yourself)
3. **Consider adding authentication** to Streamlit:
   ```python
   # Add to app.py
   import streamlit_authenticator as stauth
   ```
4. **Use environment variables** for sensitive data
5. **Deploy behind authentication** if hosting publicly

## 🌐 Deployment Options

### Option 1: Streamlit Cloud (Recommended)

1. Push code to GitHub (without `service_account.json`!)
2. Go to [Streamlit Cloud](https://streamlit.io/cloud)
3. Deploy from your repository
4. Add secrets in dashboard:
   - Click "Settings" → "Secrets"
   - Paste content of `service_account.json` as:
     ```toml
     [gcp_service_account]
     type = "service_account"
     project_id = "your-project"
     private_key_id = "key-id"
     private_key = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     client_email = "your-service-account@project.iam.gserviceaccount.com"
     client_id = "12345"
     auth_uri = "https://accounts.google.com/o/oauth2/auth"
     token_uri = "https://oauth2.googleapis.com/token"
     auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
     client_x509_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/..."
     ```

Update `app.py` to use secrets:
```python
import json
creds_dict = json.loads(st.secrets["gcp_service_account"])
creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
```

### Option 2: Local Network

Run on your computer and access from local network:
```bash
streamlit run app.py --server.address 0.0.0.0
```

### Option 3: Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py"]
```

## 🐛 Troubleshooting

### "Failed to authenticate with Google Sheets"
- Check if `service_account.json` is in the `backend` folder
- Verify the service account has access to the sheet
- Ensure Google Sheets API is enabled in your project

### "Failed to load data"
- Verify the Spreadsheet ID is correct
- Check if sheet is shared with service account email
- Ensure column headers match exactly: `Team ID`, `Team Name`, `Total XP`

### "Team not found"
- Make sure Team ID exists in the sheet
- Check for extra spaces in Team ID column

### Port already in use
```bash
streamlit run app.py --server.port 8502
```

## 📝 File Structure

```
backend/
├── app.py                    # Main Streamlit application
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .env                     # Your actual environment variables (git-ignored)
├── .gitignore              # Git ignore rules
├── service_account.json    # Google service account credentials (git-ignored)
└── README.md               # This file
```

## 🔄 Integration with Frontend

The frontend (`Leaderboard.js`) will continue to poll the Google Sheets API for updates. Any changes made through this admin panel will be visible on the website within the refresh interval (currently 10 seconds).

## 📚 Additional Resources

- [Streamlit Documentation](https://docs.streamlit.io/)
- [gspread Documentation](https://docs.gspread.org/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)

## 💡 Future Enhancements

- Add authentication for admin access
- Batch update multiple teams
- Export leaderboard history
- Add activity logs
- Email notifications on updates
- Undo/Redo functionality
- Team statistics and analytics

## 📄 License

This project is part of the XP Boost 2025 event.

---

**Need help?** Open an issue or contact the development team.
