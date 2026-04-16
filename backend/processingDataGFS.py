# processingDataGFS.py
from flask import Blueprint, jsonify
import threading
import codigoMapas   # importa tu archivo con main()

processingDataGFS = Blueprint("processingDataGFS", __name__)
estado = {"done": False}

@processingDataGFS.route("/run", methods=["POST"])
def run():
    def job():
        print('aksldjaslkdj')
        estado["done"] = False   # resetear estado al iniciar
        codigoMapas.main() 
        print('aqui aqui ')      # aquí llamas directamente a tu main()
        estado["done"] = True
    threading.Thread(target=job).start()
    return jsonify({"status": "started"})

@processingDataGFS.route("/status", methods=["GET"])
def status():
    return jsonify({"done": estado["done"]})
