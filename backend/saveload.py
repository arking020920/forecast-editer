from flask import Blueprint, request, jsonify
import json
import os

saveLoad_bp = Blueprint("saveLoad", __name__)

FILE_PATH = "pronosticos.json"

# Guardar pronóstico en archivo JSON
@saveLoad_bp.route("/guardar", methods=["POST"])
def guardar_pronostico():
    data = request.json
    username = data.get("username")
    pronostico = data.get("data")

    almacen = {}
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            almacen = json.load(f)

    almacen[username] = pronostico

    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(almacen, f, indent=2, ensure_ascii=False)

    return jsonify({"status": "success", "message": "Pronóstico guardado"}), 200

# Cargar pronóstico desde archivo JSON
@saveLoad_bp.route("/cargar/<username>", methods=["GET"])
def cargar_pronostico(username):
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            almacen = json.load(f)
        if username in almacen:
            return jsonify(almacen[username]), 200
    return jsonify({"error": "No hay datos para este usuario"}), 404
