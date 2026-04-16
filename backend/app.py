from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from config import config_bp
from saveload import saveLoad_bp
from actualizarTareas import actualizar_tareas_bp
from pdf_generator_bp import pdf_bp
from gfswave_bp import gfswave_bp 
from progress_bp import progress_bp
from processingDataGFS import processingDataGFS

app = Flask(__name__)
app.secret_key = "clave_super_secreta"
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers="*", methods=["GET", "POST", "OPTIONS"])

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(config_bp, url_prefix="/")
app.register_blueprint(saveLoad_bp, url_prefix="/pronosticos")
app.register_blueprint(actualizar_tareas_bp)
app.register_blueprint(pdf_bp)
app.register_blueprint(gfswave_bp)
app.register_blueprint(progress_bp)
app.register_blueprint(processingDataGFS)


@app.route("/")
def home():
    return {"message": "Servidor Flask funcionando 🚀"}

