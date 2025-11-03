import streamlit as st
import gspread
from google.oauth2.service_account import Credentials
import pandas as pd
import os
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="XP Boost Admin Panel",
    page_icon="🏆",
    layout="wide"
)

# Define the scope
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

@st.cache_resource
def get_google_sheets_client():
    """Initialize and return Google Sheets client"""
    try:
        # Load credentials from service account file
        creds = Credentials.from_service_account_file(
            'service_account.json',
            scopes=SCOPES
        )
        client = gspread.authorize(creds)
        return client
    except Exception as e:
        st.error(f"Failed to authenticate with Google Sheets: {str(e)}")
        return None

def load_leaderboard_data(client, spreadsheet_id):
    """Load current leaderboard data from Google Sheets"""
    try:
        spreadsheet = client.open_by_key(spreadsheet_id)
        worksheet = spreadsheet.sheet1  # Get first sheet
        
        # Get all values
        data = worksheet.get_all_records()
        df = pd.DataFrame(data)
        
        return df, worksheet
    except Exception as e:
        st.error(f"Failed to load data: {str(e)}")
        return None, None

def update_team_xp(worksheet, team_id, xp_to_add, df):
    """Update XP for a specific team"""
    try:
        # Find the row for the team (adding 2 because: 1 for header, 1 for 0-indexing)
        team_row = df[df['Team ID'].str.strip() == team_id].index[0] + 2
        
        # Get current XP
        current_xp = int(df[df['Team ID'].str.strip() == team_id]['Total XP'].values[0])
        
        # Calculate new XP
        new_xp = current_xp + xp_to_add
        
        # Update the cell (column C is 3)
        worksheet.update_cell(team_row, 3, new_xp)
        
        return True, current_xp, new_xp
    except Exception as e:
        st.error(f"Failed to update XP: {str(e)}")
        return False, 0, 0

def set_team_xp(worksheet, team_id, new_xp, df):
    """Set absolute XP value for a specific team"""
    try:
        # Find the row for the team
        team_row = df[df['Team ID'].str.strip() == team_id].index[0] + 2
        
        # Get current XP
        current_xp = int(df[df['Team ID'].str.strip() == team_id]['Total XP'].values[0])
        
        # Update the cell (column C is 3)
        worksheet.update_cell(team_row, 3, new_xp)
        
        return True, current_xp, new_xp
    except Exception as e:
        st.error(f"Failed to set XP: {str(e)}")
        return False, 0, 0

# Main app
def main():
    st.title("🏆 XP Boost Admin Panel")
    st.markdown("### Manage Team XP in Real-Time")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("Configuration")
        spreadsheet_id = st.text_input(
            "Google Sheet ID",
            value=os.getenv("SPREADSHEET_ID", ""),
            help="Enter your Google Spreadsheet ID from the URL"
        )
        
        st.markdown("---")
        st.markdown("**Instructions:**")
        st.markdown("1. Enter your Spreadsheet ID")
        st.markdown("2. Select a team")
        st.markdown("3. Add or set XP")
        st.markdown("4. Changes are instant!")
    
    if not spreadsheet_id:
        st.warning("Please enter your Google Spreadsheet ID in the sidebar")
        return
    
    # Initialize client
    client = get_google_sheets_client()
    if not client:
        return
    
    # Load data
    with st.spinner("Loading leaderboard data..."):
        df, worksheet = load_leaderboard_data(client, spreadsheet_id)
    
    if df is None or worksheet is None:
        return
    
    # Display current leaderboard
    st.subheader("📊 Current Leaderboard")
    
    # Sort by Total XP descending
    df_sorted = df.sort_values('Total XP', ascending=False).reset_index(drop=True)
    df_sorted.index = df_sorted.index + 1  # Start ranking from 1
    df_sorted.index.name = 'Rank'
    
    # Display with styling
    st.dataframe(
        df_sorted[['Team ID', 'Team Name', 'Total XP']],
        use_container_width=True,
        height=400
    )
    
    st.markdown("---")
    
    # Update section
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("➕ Add XP to Team")
        
        # Team selection
        team_list = sorted(df['Team ID'].str.strip().tolist())
        selected_team_add = st.selectbox(
            "Select Team",
            options=team_list,
            key="add_team"
        )
        
        # Display current XP
        if selected_team_add:
            current_xp_add = df[df['Team ID'].str.strip() == selected_team_add]['Total XP'].values[0]
            team_name_add = df[df['Team ID'].str.strip() == selected_team_add]['Team Name'].values[0]
            st.info(f"**{team_name_add}** | Current XP: **{current_xp_add}**")
        
        # XP to add
        xp_to_add = st.number_input(
            "XP to Add",
            min_value=-100000,
            max_value=100000,
            value=100,
            step=50,
            key="xp_add"
        )
        
        if st.button("Add XP", type="primary", use_container_width=True):
            success, old_xp, new_xp = update_team_xp(worksheet, selected_team_add, xp_to_add, df)
            if success:
                st.success(f"✅ Updated! {old_xp} → {new_xp} XP")
                st.rerun()
    
    with col2:
        st.subheader("🎯 Set Absolute XP")
        
        # Team selection
        selected_team_set = st.selectbox(
            "Select Team",
            options=team_list,
            key="set_team"
        )
        
        # Display current XP
        if selected_team_set:
            current_xp_set = df[df['Team ID'].str.strip() == selected_team_set]['Total XP'].values[0]
            team_name_set = df[df['Team ID'].str.strip() == selected_team_set]['Team Name'].values[0]
            st.info(f"**{team_name_set}** | Current XP: **{current_xp_set}**")
        
        # New XP value
        new_xp_value = st.number_input(
            "New XP Value",
            min_value=0,
            max_value=1000000,
            value=current_xp_set if selected_team_set else 1000,
            step=100,
            key="xp_set"
        )
        
        if st.button("Set XP", type="secondary", use_container_width=True):
            success, old_xp, new_xp = set_team_xp(worksheet, selected_team_set, new_xp_value, df)
            if success:
                st.success(f"✅ Updated! {old_xp} → {new_xp} XP")
                st.rerun()
    
    # Footer
    st.markdown("---")
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
