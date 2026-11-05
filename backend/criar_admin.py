from getpass import getpass

from sqlalchemy import text
from werkzeug.security import generate_password_hash

from db import engine

nome = input("Nome: ").strip()
email = input("E-mail: ").strip().lower()
senha = getpass("Senha (mín. 8 caracteres): ")
confirmacao = getpass("Confirme a senha: ")

if not nome or not email:
    raise SystemExit("Nome e e-mail são obrigatórios.")
if len(senha) < 8:
    raise SystemExit("A senha precisa ter pelo menos 8 caracteres.")
if senha != confirmacao:
    raise SystemExit("As senhas não conferem.")

with engine.begin() as conn:
    existe = conn.execute(
        text("SELECT 1 FROM usuarios WHERE email = :email"),
        {"email": email},
    ).first()
    if existe:
        raise SystemExit("Já existe um usuário com esse e-mail.")

    conn.execute(
        text(
            "INSERT INTO usuarios (nome, email, senha_hash, perfil) "
            "VALUES (:nome, :email, :hash, 'ADMINISTRADOR')"
        ),
        {"nome": nome, "email": email, "hash": generate_password_hash(senha)},
    )

print(f"✅ Admin '{nome}' criado.")