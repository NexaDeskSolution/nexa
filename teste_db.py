import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

params = quote_plus(
    f"DRIVER={{{os.getenv('DB_DRIVER')}}};"
    f"SERVER={os.getenv('DB_SERVER')};"
    f"DATABASE={os.getenv('DB_NAME')};"
    f"UID={os.getenv('DB_USER')};PWD={os.getenv('DB_PASSWORD')};"
    f"TrustServerCertificate={os.getenv('DB_TRUST_CERT', 'no')};"
)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

load_dotenv()

server = os.getenv("DB_SERVER")
database = os.getenv("DB_DATABASE")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

connection_string = f"mssql+pyodbc://{user}:{password}@{server}/{database}?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"

try:
    print("Tentando conectar ao banco de dados...")
    engine = create_engine(connection_string)
    
    with engine.connect() as connection:
        result = connection.execute(text("SELECT @@VERSION;"))
        for row in result:
            print("\n✅ Sucesso! Conectado ao SQL Server:\n", row[0])
            
except Exception as e:
    print("\n❌ Erro ao conectar ao banco de dados:")
    print(e)
