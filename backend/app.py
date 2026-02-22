from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from config import config_bp
from saveload import saveLoad_bp
from actualizarTareas import actualizar_tareas_bp

app = Flask(__name__)
app.secret_key = "clave_super_secreta"
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(config_bp, url_prefix="/")
app.register_blueprint(saveLoad_bp, url_prefix="/pronosticos")
app.register_blueprint(actualizar_tareas_bp)

@app.route("/")
def home():
    return {"message": "Servidor Flask funcionando 🚀"}

