import os
import re
from flask import Blueprint, request, jsonify
from docx import Document  # pip install python-docx

# Creamos un Blueprint para poder cargarlo en app.py
actualizar_tareas_bp = Blueprint("actualizar_tareas", __name__)

def check_save_file(full_path: str) -> dict:
    print(f"Verificando archivo en: {full_path}")
    exists = os.path.exists(full_path)
    print(f"Resultado: {exists}")
    return {"exists": exists}


def check_save_in_red_file(file_name: str, routes: list, expected_pattern: str) -> dict:
    """
    Busca el archivo en las rutas dadas y valida el patrón MUHV.
    """
    found = False
    matched = False
    matched_patterns = []
    print('mastodonte')

    for route in routes:
        full_path = os.path.join(route, file_name)
        if os.path.exists(full_path):
            found = True
            try:
                # Lectura según extensión
                if file_name.lower().endswith(".docx"):
                    doc = Document(full_path)
                    text = "\n".join([p.text for p in doc.paragraphs])
                else:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()

                # Regex tolerante
                regex = re.compile(expected_pattern, re.IGNORECASE)
                matches = regex.findall(text)
                if matches:
                    matched = True
                    matched_patterns.extend(matches)

            except Exception as e:
                return {"found": True, "matched": False, "error": str(e)}

    return {
        "found": found,
        "matched": matched,
        "matchedPatterns": matched_patterns
    }

# Endpoints
@actualizar_tareas_bp.route("/api/check-save", methods=["POST"])
def api_check_save():
    print('AAAAAAAAAAAAAAA')
    data = request.get_json()
    full_path = data.get("fullPath")
    try:
        result = check_save_file(full_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({"exists": False, "error": str(e)}), 500

@actualizar_tareas_bp.route("/api/check-save-in-red", methods=["POST"])
def api_check_save_in_red():
    data = request.get_json()
    file_name = data.get("fileName")
    routes = data.get("routes", [])
    expected_pattern = data.get("expectedPattern")
    try:
        result = check_save_in_red_file(file_name, routes, expected_pattern)
        return jsonify(result)
    except Exception as e:
        return jsonify({"found": False, "matched": False, "error": str(e)}), 500
