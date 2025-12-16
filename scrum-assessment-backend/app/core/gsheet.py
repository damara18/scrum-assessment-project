import gspread

from google.oauth2.service_account import Credentials
from app.core.config import Settings


def get_google_sheet_file(filename: str):
    # Load service account credentials
    SCOPES = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    creds = Credentials.from_service_account_file(
        Settings.GSHEET_ACCOUNT_CREDENTIALS_FILE, scopes=SCOPES
    )

    # Authorize with gspread
    client = gspread.authorize(creds)

    file = client.open(filename)
    return file
