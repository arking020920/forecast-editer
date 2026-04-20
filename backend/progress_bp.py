# progress_bp.py
from flask import Blueprint, jsonify, request
import os

progress_bp = Blueprint("progress", __name__)

# Ruta base donde se guardan los datos
BASE_DIR = r"D:\Armin\Salva Diaria\forecast-editer\forecast-editer\datos"

@progress_bp.route("/progress", methods=["GET"])
def check_progress():
    try:
        # Carpeta solicitada por el frontend
        folder_name = request.args.get("folder")
        if not folder_name:
            return jsonify({"message": "Falta parámetro 'folder'", "progress": 0})

        folder_path = os.path.join(BASE_DIR, folder_name)
        if not os.path.exists(folder_path):
            return jsonify({"message": "Carpeta no encontrada", "progress": 0})

        # Contar archivos presentes
        files = sorted(os.listdir(folder_path))
        total_expected = 97   # ejemplo: 4 días a 1h = 96 archivos
        grib2_files = [f for f in files if f.endswith(".grib2")]
        downloaded = len(grib2_files)

        progress = int(downloaded / total_expected * 100)

        return jsonify({
            "message": f"{downloaded}/{total_expected} archivos descargados",
            "progress": progress,
            "files": files
        })
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}", "progress": 0})
