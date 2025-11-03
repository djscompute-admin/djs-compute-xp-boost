"""
Debug script to test Google Sheets API connection
Run this to diagnose connection issues
"""

import gspread
from google.oauth2.service_account import Credentials
import json
import os

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

def main():
    print("🔍 Debugging Google Sheets Connection\n")
    print("=" * 60)
    
    # Step 1: Check if service_account.json exists
    print("\n1. Checking for service_account.json...")
    if not os.path.exists('service_account.json'):
        print("   ❌ ERROR: service_account.json not found!")
        print("   📝 Please download it from Google Cloud Console and place it in the backend folder")
        return
    print("   ✅ service_account.json found")
    
    # Step 2: Validate JSON structure
    print("\n2. Validating service account JSON...")
    try:
        with open('service_account.json', 'r') as f:
            sa_data = json.load(f)
        
        required_fields = ['type', 'project_id', 'private_key', 'client_email']
        missing = [f for f in required_fields if f not in sa_data]
        
        if missing:
            print(f"   ❌ ERROR: Missing fields: {', '.join(missing)}")
            return
        
        print("   ✅ JSON structure is valid")
        print(f"   📧 Service Account Email: {sa_data['client_email']}")
        print(f"   🏷️  Project ID: {sa_data['project_id']}")
        
    except json.JSONDecodeError as e:
        print(f"   ❌ ERROR: Invalid JSON format: {str(e)}")
        return
    
    # Step 3: Test authentication
    print("\n3. Testing Google Sheets authentication...")
    try:
        creds = Credentials.from_service_account_file(
            'service_account.json',
            scopes=SCOPES
        )
        client = gspread.authorize(creds)
        print("   ✅ Authentication successful")
    except Exception as e:
        print(f"   ❌ ERROR: Authentication failed: {str(e)}")
        return
    
    # Step 4: Get Spreadsheet ID
    print("\n4. Testing spreadsheet access...")
    spreadsheet_id = input("   📋 Enter your Spreadsheet ID: ").strip()
    
    if not spreadsheet_id:
        print("   ❌ ERROR: No Spreadsheet ID provided")
        return
    
    # Step 5: Try to open spreadsheet
    print(f"\n5. Attempting to open spreadsheet: {spreadsheet_id[:10]}...")
    try:
        spreadsheet = client.open_by_key(spreadsheet_id)
        print("   ✅ Spreadsheet opened successfully!")
        print(f"   📄 Spreadsheet Title: {spreadsheet.title}")
        
        # Get first worksheet
        worksheet = spreadsheet.sheet1
        print(f"   📊 First Sheet: {worksheet.title}")
        
        # Get data
        data = worksheet.get_all_records()
        print(f"   📈 Found {len(data)} rows of data")
        
        if len(data) > 0:
            print(f"   📝 Columns: {', '.join(data[0].keys())}")
            print("\n   ✅ SUCCESS! Connection is working perfectly!")
            print("\n   💡 You can now use this Spreadsheet ID in the Streamlit app")
        else:
            print("   ⚠️  WARNING: Sheet is empty")
            
    except gspread.exceptions.SpreadsheetNotFound:
        print("   ❌ ERROR: Spreadsheet not found (404)")
        print("\n   🔧 SOLUTION:")
        print(f"      1. Open your Google Sheet")
        print(f"      2. Click 'Share' button")
        print(f"      3. Add this email: {sa_data['client_email']}")
        print(f"      4. Give 'Editor' permissions")
        print(f"      5. Uncheck 'Notify people'")
        print(f"      6. Click 'Share'")
        
    except gspread.exceptions.APIError as e:
        print(f"   ❌ ERROR: API Error: {str(e)}")
        print("\n   🔧 Check if Google Sheets API is enabled in Google Cloud Console")
        
    except Exception as e:
        print(f"   ❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
