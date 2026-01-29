from flask import Blueprint, request, jsonify
import os, json

config_bp = Blueprint("config", __name__)
CONFIG_DIR = os.path.join(os.path.dirname(__file__), "user_configs")

os.makedirs(CONFIG_DIR, exist_ok=True)

@config_bp.route("/config/<username>", methods=["GET"])
def get_config(username):
    path = os.path.join(CONFIG_DIR, f"{username}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return jsonify(json.load(f))
    return jsonify({"shortcuts": []})

@config_bp.route("/config/<username>", methods=["POST"])
def save_config(username):
    data = request.json
    path = os.path.join(CONFIG_DIR, f"{username}.json")
    with open(path, "w") as f:
        json.dump(data, f)
    return jsonify({"success": True})
