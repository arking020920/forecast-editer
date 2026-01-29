from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from config import config_bp

app = Flask(__name__)
app.secret_key = "clave_super_secreta"
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(config_bp, url_prefix="/")

@app.route("/")
def home():
    return {"message": "Servidor Flask funcionando 🚀"}

