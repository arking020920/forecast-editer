# pdf_generator_bp.py
import os
import json
import logging
from flask import Blueprint, request, send_file, jsonify, current_app
from docx import Document
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("informe-generator")

pdf_bp = Blueprint("pdf_generator", __name__, url_prefix="/pdf")

# Configuración por defecto; se pueden sobreescribir desde app.py si lo deseas
DEFAULT_ALLOWED = os.getenv("ALLOWED_DOCX_DIRS", "/data/docx").split(";")
DEFAULT_USE_ID_MAP = os.getenv("USE_ID_MAP", "true").lower() == "true"
DEFAULT_ID_MAP_FILE = os.getenv("ID_MAP_FILE", "id_map.json")

def _load_id_map(id_map_file):
    try:
        if Path(id_map_file).exists():
            with open(id_map_file, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.warning("No se pudo cargar ID_MAP_FILE: %s", e)
    return {}

def _is_path_allowed(path_str: str, allowed_dirs):
    try:
        p = Path(path_str).resolve()
        for allowed in allowed_dirs:
            if p.is_relative_to(Path(allowed).resolve()):
                return True
        return False
    except Exception:
        return False

def _resolve_docx_path(identifier_or_path: str, allowed_dirs, use_id_map, id_map):
    if use_id_map:
        if identifier_or_path in id_map:
            candidate = id_map[identifier_or_path]
            if _is_path_allowed(candidate, allowed_dirs):
                return candidate
            return None
        if os.path.isabs(identifier_or_path) and _is_path_allowed(identifier_or_path, allowed_dirs):
            return identifier_or_path
        return None
    else:
        if os.path.isabs(identifier_or_path) and _is_path_allowed(identifier_or_path, allowed_dirs):
            return identifier_or_path
        return None

def _read_docx_text(path: str) -> str:
    if not os.path.exists(path):
        return ""
    doc = Document(path)
    paragraphs = []
    for p in doc.paragraphs:
        text = p.text.strip()
        if text:
            paragraphs.append(text)
    return "\n".join(paragraphs)

def _add_wrapped_text(c: canvas.Canvas, text: str, x: float, y: float, max_width: float, line_height: float, font_name="Helvetica", font_size=10):
    c.setFont(font_name, font_size)
    for original_line in text.split("\n"):
        line = original_line.strip()
        if not line:
            y -= line_height
            continue
        approx_chars = max(10, int(max_width / (font_size * 0.55)))
        for i in range(0, len(line), approx_chars):
            chunk = line[i:i+approx_chars]
            c.drawString(x, y, chunk)
            y -= line_height
            if y < 80:
                c.showPage()
                y = A4[1] - 40
                c.setFont(font_name, font_size)
    return y

@pdf_bp.route("/generate", methods=["POST"])
def generate_pdf():
    """
    POST /pdf/generate
    JSON esperado:
      - fecha: ISO string
      - pronosticadores: [ "Nombre A", ... ]
      - tasksSummary: [{ id, name, checked, observation }]
      - generalObservation: string
      - checkedFullPaths: [ id_or_path, ... ]
    """
    # Leer configuración desde current_app.config si existe, sino usar defaults
    allowed_dirs = current_app.config.get("ALLOWED_DOCX_DIRS", DEFAULT_ALLOWED)
    use_id_map = current_app.config.get("USE_ID_MAP", DEFAULT_USE_ID_MAP)
    id_map_file = current_app.config.get("ID_MAP_FILE", DEFAULT_ID_MAP_FILE)
    id_map = _load_id_map(id_map_file) if use_id_map else {}

    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({"error": "JSON inválido", "detail": str(e)}), 400

    fecha = data.get("fecha") or datetime.utcnow().isoformat()
    pronosticadores = data.get("pronosticadores", [])
    tasks_summary = data.get("tasksSummary", [])
    general_observation = data.get("generalObservation", "")
    checked_list = data.get("checkedFullPaths", [])

    if not isinstance(checked_list, list):
        return jsonify({"error": "checkedFullPaths debe ser una lista"}), 400

    texts = []
    for ident in checked_list:
        resolved = _resolve_docx_path(ident, allowed_dirs, use_id_map, id_map)
        if not resolved:
            texts.append({"id_or_path": ident, "path": None, "text": "[Ruta no permitida o no encontrada]"})
            continue
        text = _read_docx_text(resolved)
        texts.append({"id_or_path": ident, "path": resolved, "text": text or "[Archivo vacío o sin texto]"})
    
    # Construir PDF
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    margin = 40
    y = height - margin

    c.setFont("Helvetica-Bold", 12)
    try:
        fecha_display = fecha[:10]
    except Exception:
        fecha_display = datetime.utcnow().date().isoformat()
    c.drawString(margin, y, f"Fecha: {fecha_display}")
    y -= 18
    c.setFont("Helvetica", 11)
    c.drawString(margin, y, "Pronosticadores: " + (", ".join(pronosticadores) if pronosticadores else "—"))
    y -= 20

    c.setFont("Helvetica", 11)
    for t in tasks_summary:
        emoji = "✅" if t.get("checked") else "❌"
        name = t.get("name", t.get("id", "Tarea"))
        line = f"{emoji} {name}"
        c.drawString(margin, y, line)
        y -= 14
        obs = t.get("observation")
        if obs:
            c.setFont("Helvetica-Oblique", 10)
            y = _add_wrapped_text(c, f"Observación: {obs}", margin + 12, y, width - margin*2 - 12, 12, font_size=10)
            c.setFont("Helvetica", 11)
        if y < 120:
            c.showPage()
            y = height - margin

    if general_observation:
        y -= 8
        c.setFont("Helvetica-Bold", 11)
        c.drawString(margin, y, "Observaciones generales:")
        y -= 14
        c.setFont("Helvetica", 10)
        y = _add_wrapped_text(c, general_observation, margin, y, width - margin*2, 12, font_size=10)

    for item in texts:
        if y < 120:
            c.showPage()
            y = height - margin
        c.setFont("Helvetica-Bold", 11)
        header = f"------ Inicio: {Path(item.get('path') or item.get('id_or_path')).name} ------"
        c.drawString(margin, y, header)
        y -= 16
        c.setFont("Helvetica", 10)
        y = _add_wrapped_text(c, item.get("text", ""), margin, y, width - margin*2, 12, font_size=10)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(margin, y, f"------ Fin: {Path(item.get('path') or item.get('id_or_path')).name} ------")
        y -= 18

    c.save()
    buffer.seek(0)
    filename = f"informe_{fecha_display}.pdf"
    return send_file(buffer, as_attachment=True, download_name=filename, mimetype="application/pdf")

@pdf_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})
