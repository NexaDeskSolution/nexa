import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv(override=True)

params = quote_plus(
    f"DRIVER={{{os.getenv('DB_DRIVER')}}};"
    f"SERVER={os.getenv('DB_SERVER')};"
    f"DATABASE={os.getenv('DB_NAME')};"
    f"UID={os.getenv('DB_USER')};"
    f"PWD={os.getenv('DB_PASSWORD')};"
    f"TrustServerCertificate={os.getenv('DB_TRUST_CERT', 'no')};"
)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

print("Usuário:", os.getenv("DB_USER"), "| Banco:", os.getenv("DB_NAME"))

try:
    print("Tentando conectar ao banco de dados...")
    with engine.connect() as connection:
        version = connection.execute(text("SELECT @@VERSION;")).scalar()
        print("\n✅ Sucesso! Conectado ao SQL Server:\n", version)
except Exception as e:
    print("\n❌ Erro ao conectar ao banco de dados:")
    print(e)