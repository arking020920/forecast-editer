# gfswave_bp.py
from flask import Blueprint, jsonify
import os
import requests
from datetime import datetime

gfswave_bp = Blueprint("gfswave", __name__)

# Carpeta destino
BASE_DIR = r"D:\Armin\Salva Diaria\forecast-editer\forecast-editer\datos\gfs-wave"
os.makedirs(BASE_DIR, exist_ok=True)

@gfswave_bp.route("/download-gfswave", methods=["GET"])
def download_gfswave():
    try:
        now = datetime.utcnow()
        yyyy = now.year
        mm = str(now.month).zfill(2)
        dd = str(now.day).zfill(2)
        date_str = f"{yyyy}{mm}{dd}"
        file_date_name = f"{dd}{mm}{yyyy}"

        cycles = ["18", "12", "06", '00']
        chosen_cycle = None

        proxies = {
            "http": "http://alejandro.rodriguez:Oleaje2016@10.0.100.191:3128",
            "https": "http://alejandro.rodriguez:Oleaje2016@10.0.100.191:3128",
        }

        # Detectar ciclo válido
        for cycle in cycles:
            test_url = f"https://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/gfs.{date_str}/{cycle}/wave/gridded/gfswave.t{cycle}z.atlocn.0p16.f000.grib2"
            print(test_url)
            resp = requests.get(test_url, stream=True, timeout=10, proxies=proxies)
            if resp.status_code == 200:
                print(cycle, 'el ciclo')
                chosen_cycle = cycle
                break

        if not chosen_cycle:
            return jsonify({"progress": 0, "message": "No hay datos disponibles hoy.", "downloaded_files": []})

        total_files = 96  # 4 días = 96 horas / 3h = 32 archivos
        downloaded_files = []

        for idx, i in enumerate(range(0, 97)):
            f_str = str(i).zfill(3)
            url = f"https://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/gfs.{date_str}/{chosen_cycle}/wave/gridded/gfswave.t{chosen_cycle}z.atlocn.0p16.f{f_str}.grib2"
            resp = requests.get(url, stream=True, timeout=10, proxies=proxies)

            if resp.status_code == 200:
                filename = f"{f_str}.gfs.wave.extension.grib2"
                file_path = os.path.join(BASE_DIR, filename)
                with open(file_path, "wb") as f:
                    f.write(resp.content)
                downloaded_files.append(filename)
        if downloaded_files:
            info_str = f"{dd}{mm}{yyyy}{chosen_cycle}"
            info_path = os.path.join(BASE_DIR, "info.txt")
            with open(info_path, "w") as f:
                f.write(info_str)

        return jsonify({
            "progress": int(len(downloaded_files) / total_files * 100),
            "message": f"Descarga completada para ciclo {chosen_cycle} UTC.",
            "downloaded_files": downloaded_files
        })

    except Exception as e:
        return jsonify({"progress": 0, "message": f"Error en la descarga: {str(e)}", "downloaded_files": []})


# Nuevo endpoint para consultar la info
@gfswave_bp.route("/info-gfswave", methods=["GET"])
def info_gfswave():
    info_path = os.path.join(BASE_DIR, "info.txt")
    if not os.path.exists(info_path):
        return jsonify({"message": "No hay info"})

    try:
        with open(info_path, "r") as f:
            content = f.read().strip()  # ej: 1204202612
        # Parsear contenido: dd mm yyyy hh
        dd = content[0:2]
        mm = content[2:4]
        yyyy = content[4:8]
        hh = content[8:10]

        # Nombre del mes en español
        meses = {
            "01": "enero", "02": "febrero", "03": "marzo", "04": "abril",
            "05": "mayo", "06": "junio", "07": "julio", "08": "agosto",
            "09": "septiembre", "10": "octubre", "11": "noviembre", "12": "diciembre"
        }
        mes_nombre = meses.get(mm, mm)

        mensaje = f"Los últimos datos descargados son del {dd} de {mes_nombre} del {yyyy} a las {hh} UTC."
        return jsonify({"message": mensaje, "fecha": f'{dd}/{mm}/{yyyy}/{hh}utc' })
    except Exception as e:
        return jsonify({"message": f"Error al leer info: {str(e)}"})