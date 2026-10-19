from pathlib import Path
from flask import Flask, render_template

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / "frontend"

app = Flask(
    __name__,
    template_folder=str(FRONTEND_DIR / "templates"),
    static_folder=str(FRONTEND_DIR / "static"),
    static_url_path="/static",
)

@app.get("/")
def index():
    """Entrega a interface inicial do NexaDesk."""
    return render_template("index.html")

@app.get("/health")
def health():
    """Verificação simples para desenvolvimento."""
    return {"status": "ok", "app": "NexaDesk frontend"}

if __name__ == "__main__":
    app.run(debug=True)
