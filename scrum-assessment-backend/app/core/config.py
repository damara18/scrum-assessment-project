import os

GSHEET_COLUMNS = {
    "Adanya peran Scrum": ["E", "G"],
    "Adanya Scrum Artifacts": ["H", "P"],
    "Adanya Scrum meeting dan dipartisipasi": ["Q", "U"],
    "Alur proses Scrum dihormati": ["V", "W"],
    "Definisi yang jelas tentang Product owner": ["X", "Z"],
    "Manajemen Product Backlog": ["AA", "AC"],
    "Sprint Planning Meeting yang sukses": ["AD", "AI"],
    "Adanya Definition of Done": ["AJ", "AK"],
    "Product Owner tersedia": ["AL"],
    "Sprint Review Meeting yang sukses": ["AM", "AN"],
    "Manajemen Sprint Backlog": ["AO", "AV"],
    "Iterasi direncanakan": ["AW", "AZ"],
    "Velocity terukur": ["BA", "BC"],
    "Daily Scrum yang sukses": ["BD", "BF"],
    "Manajemen proyek terpadu": ["BG", "BL"],
    "Analisis Manajemen": ["BM", "BP"],
    "Sprint Retrospective yang sukses": ["BQ", "BR"],
    "Analisis penyebab dan penyelesaian": ["BS", "BT"],
    "Indikator positif": ["BU", "BV"],
}

SECTION_GROUPS = {
    "Basic Scrum Management": [
        "Adanya peran Scrum",
        "Adanya Scrum Artifacts",
        "Adanya Scrum meeting dan dipartisipasi",
        "Alur proses Scrum dihormati",
    ],
    "Software Requirement Engineering": [
        "Definisi yang jelas tentang Product owner",
        "Manajemen Product Backlog",
        "Sprint Planning Meeting yang sukses",
    ],
    "Customer Relationship Management": [
        "Adanya Definition of Done",
        "Product Owner tersedia",
        "Sprint Review Meeting yang sukses",
    ],
    "Iteration Management": [
        "Manajemen Sprint Backlog",
        "Iterasi direncanakan",
        "Velocity terukur",
        "Daily Scrum yang sukses",
    ],
    "Standardized Project Management": ["Manajemen proyek terpadu"],
    "Process Performance Management": ["Analisis Manajemen"],
    "Performance Management": [
        "Sprint Retrospective yang sukses",
        "Analisis penyebab dan penyelesaian",
        "Indikator positif",
    ],
}

LEVEL_CONSTANT = {
    "Level 2 (Managed)": ["Basic Scrum Management", "Software Requirement Engineering"],
    "Level 3 (Defined)": ["Customer Relationship Management", "Iteration Management"],
    "Level 4 (Quantitatively Managed)": [
        "Standardized Project Management",
        "Process Performance Management",
    ],
    "Level 5 (Optimizing)": ["Performance Management"],
}

SCORE_CONSTANT = {
    "Fully Achieved": (86, 100),
    "Largely Achieved": (51, 86),
    "Partially Achieved": (16, 51),
    "Not Achieved": (0, 16),
}


class MainAdmin:
    USERNAME = "MAIN_ADMIN"
    FULLNAME = "MAIN_ADMIN"
    PASSWORD = os.environ.get("MAIN_ADMIN_PASSWORD")
    EMAIL = os.environ.get("MAIN_ADMIN_EMAIL")


class Settings:
    PROJECT_NAME = "Scrum Assessment Backend"
    GSHEET_COLUMNS = GSHEET_COLUMNS
    DATABASE_URL = os.environ.get("DATABASE_URL")
    MAIN_ADMIN = MainAdmin()
    SECRET_KEY = os.environ.get("SECRET_KEY")
    ALGORITHM = os.environ.get("ALGORITHM")

    base_path = os.path.dirname(os.path.abspath(__file__))
    GSHEET_ACCOUNT_CREDENTIALS_FILE = os.path.join(
        base_path, os.environ.get("GSHEET_ACCOUNT_CREDENTIALS_FILE")
    )


settings = Settings()
