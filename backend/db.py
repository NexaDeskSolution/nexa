import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv(override=True)


def _build_url() -> str:
    params = quote_plus(
        f"DRIVER={{{os.getenv('DB_DRIVER')}}};"
        f"SERVER={os.getenv('DB_SERVER')};"
        f"DATABASE={os.getenv('DB_NAME')};"
        f"UID={os.getenv('DB_USER')};"
        f"PWD={os.getenv('DB_PASSWORD')};"
        f"TrustServerCertificate={os.getenv('DB_TRUST_CERT', 'no')};"
    )
    return f"mssql+pyodbc:///?odbc_connect={params}"


engine = create_engine(_build_url(), pool_pre_ping=True)