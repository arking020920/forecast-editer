import os
import re
from flask import Blueprint, request, jsonify
from docx import Document  # pip install python-docx
import docx2txt

# Creamos un Blueprint para poder cargarlo en app.py
actualizar_tareas_bp = Blueprint("actualizar_tareas", __name__)

def check_save_file(full_path: str) -> dict:
    exists = os.path.exists(full_path)
    return {"exists": exists}

def extract_text_docx(full_path: str) -> str:
    """
    Intenta leer el texto de un DOCX con python-docx.
    Si no obtiene nada, usa docx2txt como fallback.
    """
    text = ""
    try:
        doc = Document(full_path)
        text = "\n".join([p.text for p in doc.paragraphs])
    except Exception as e:
        print(f"[ERROR] python-docx falló en {full_path}: {e}")

    # Si el texto está vacío o muy corto, usar docx2txt
    if not text.strip() or len(text.strip()) < 10:
        print(f"[INFO] Usando docx2txt para {full_path}")
        try:
            text = docx2txt.process(full_path)
        except Exception as e:
            print(f"[ERROR] docx2txt también falló en {full_path}: {e}")
            text = ""

    return text

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
            print(f"Verificando archivo en: {full_path}")
            found = True
            try:
                # Lectura según extensión
                if file_name.lower().endswith(".docx"):
                    text = extract_text_docx(full_path)
                    print("[LOG] Texto analizado (primeros 200 chars):", repr(text[:200]))
                else:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()

                # Regex tolerante
                regex = re.compile(expected_pattern, re.IGNORECASE | re.DOTALL)
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
