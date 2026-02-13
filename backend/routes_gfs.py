# routes_gfs.py
import os
import requests
from flask import Blueprint, Response
from datetime import datetime, timedelta

gfs_bp = Blueprint("gfs", __name__)

SAVE_PATH = r"C:\Users\ARMIN\Desktop\Reactjs\forecast-editer\forecast-editer\backend\datosGFS"

def get_base_url():
    # Hora actual UTC
    now = datetime.utcnow()

    # Si estamos entre 00:00 y 07:00 UTC → usar fecha del día anterior
    if now.hour < 7:
        target_date = now - timedelta(days=1)
    else:
        target_date = now

    date_str = target_date.strftime("%Y%m%d")
    cycle = "12"  # puedes parametrizar si quieres otros ciclos (00,06,12,18)

    base_url = f"https://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/gfs.{date_str}/{cycle}/wave/gridded/"
    return base_url, cycle, date_str

@gfs_bp.route("/descargar-gfs", methods=["POST"])
def descargar_gfs():
    def generate():
        base_url, cycle, date_str = get_base_url()
        total_files = 73  # f000 hasta f072
        for i, hour in enumerate(range(0, 73, 3)):
            fstr = f"{hour:03d}"
            filename = f"gfswave.t{cycle}z.atlocn.0p16.f{fstr}.grib2"
            url = base_url + filename
            save_file = os.path.join(SAVE_PATH, filename)

            r = requests.get(url)
            with open(save_file, "wb") as f:
                f.write(r.content)

            progress = int(((i+1)/total_files)*100)
            yield f"{progress}\n"

    return Response(generate(), mimetype="text/plain")
