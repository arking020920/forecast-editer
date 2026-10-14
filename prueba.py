import xarray as xr
import os
import glob
import shutil

from config import BASE_DIR
from config import MAPAS_DIR


BASE_DIR = BASE_DIR + "\gfs-wave"
DOMINIOS = {
     "Cuba": {
        # Costa norte
        "CSA-PH": (21.8, 23.5, 275.0, 279.0),   # Cabo San Antonio – Península de Hicacos
        "PH-PM":  (21.34, 23.5, 279.0, 283.0),   # Península de Hicacos – Punta Maternillos
        "PM-PMAI":(20, 23.5, 283.0, 287.0),   # Punta Maternillos – Punta Maisí

        # Costa sur
        "PMAI-CC":(19.3, 20.25, 282.0, 287.0),   # Punta Maisí – Cabo Cruz
        "CC-CSA": (19.5, 23, 275.0, 283.0),   # Cabo Cruz – Cabo San Antonio
    },
    "MaresAdyacentes": {
        # Golfo de México
        "GMNOCC": (25, 30, 260, 270),   # Golfo noroccidental
        "GMSOCC": (18.1, 24.2, 260, 270),   # Golfo suroccidental
        "GMNOR":  (25, 30, 270, 280),   # Golfo nororiental
        "GMSOR":  (18, 25.25, 270, 280),   # Golfo suroriental

        # Caribe
        "MCN":    (11.5, 22, 270, 284),   # Caribe norte
        "MCS":    (10, 20, 284, 300),   # Caribe sur
        "GMOS":   (7.5, 11.5, 276, 284),   # Golfo de los Mosquitos

        # Atlántico
        "ANO":    (25.8, 32.3, 278, 290),   # Atlántico noroccidental
        "ASO":    (19.8, 25.8, 282, 290),   # Atlántico suroccidental
        "ANE":    (24.5, 32.3, 290, 300),   # Atlántico nororiental
        "ASE":    (16.5, 24.5, 290, 300),   # Atlántico suroriental

        # Canal de las Bahamas
        "CBAH":   (19.5, 27, 278, 287)    # Canal Viejo de Bahamas
    }
}
def mapa():
    for item in os.listdir(MAPAS_DIR):
            item_path = os.path.join(MAPAS_DIR, item)
            
            # Si es una carpeta, la elimina con todo su contenido
            if os.path.isdir(item_path):
                shutil.rmtree(item_path)
                print(f"Carpeta eliminada: {item_path}")
            files = sorted(glob.glob(os.path.join(BASE_DIR, "*.grib2")))
            for f in files:
                ds = xr.open_dataset(f, engine="cfgrib")
                factor = 1.94384
                dominio=21.8, 23.5, 275.0, 279.0
                lat_min, lat_max, lon_min, lon_max = dominio
                data = ds["swh"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))
                u = ds["u"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))*factor
                v = ds["v"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))*factor