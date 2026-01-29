from flask import Blueprint, request, jsonify
import json
import os

auth_bp = Blueprint("auth", __name__)

# Cargar usuarios desde archivo JSON
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_users()
    user = users.get(username)

    if user and user["password"] == password:
        return jsonify({"success": True, "user": username})
    return jsonify({"success": False, "message": "Credenciales inválidas"}), 401
