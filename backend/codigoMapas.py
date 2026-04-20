import os
import glob
import xarray as xr
import matplotlib
matplotlib.use("Agg") 
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import shutil

BASE_DIR = r"D:\Armin\Salva Diaria\forecast-editer\forecast-editer\datos\gfs-wave"
MAPAS_DIR = r"D:\Armin\Salva Diaria\forecast-editer\forecast-editer\public\Mapas"


# Definir dominios (ejemplo, completa con todos)
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

# Escalas personalizadas
ESCALAS = {
    "Cuba": {
        "redondeada": [0,0.5,1.0,1.5,2.5,4.0,6.0,8.0],
    },
    "MaresAdyacentes": {
        "redondeada": [0,0.5,1.25,2.5,4,6,9,14]
    }
}

def generar_nombre(ds):
    """Genera nombre de archivo tipo dd.mm.yyyy.hhutc.jpeg"""
    # Intentamos primero con valid_time, si no existe usamos time
    if "valid_time" in ds:
        fecha = ds.valid_time.values
    elif "time" in ds:
        fecha = ds.time.values
    else:
        raise ValueError("El dataset no tiene ni valid_time ni time")

    # Si es array, tomamos el primer elemento
    if hasattr(fecha, "__len__") and len(fecha) > 0:
        fecha = fecha[0]

    fecha = str(fecha)   # '2026-04-12T07:00:00.000000000'
    yyyy = fecha[0:4]
    mm = fecha[5:7]
    dd = fecha[8:10]
    hh = fecha[11:13]
    return f"{dd}.{mm}.{yyyy}.{hh}utc.jpeg"

def aplicar_escala(data, grupo, tipo="redondeada"):
    """Aplica solo la escala redondeada a los datos"""
    if tipo == "redondeada":
        bins = ESCALAS[grupo]["redondeada"]
        data_binned = np.digitize(data, bins, right=False)
        return data_binned, bins
    else:
        # Si se pasa otro tipo, simplemente devuelve los datos sin cambios
        return data, None


def plot_altura(ds, dominio, outpath, grupo, escala="redondeada"):
    lat_min, lat_max, lon_min, lon_max = dominio
    data = ds["swh"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))
    valores, rango = aplicar_escala(data.values, grupo, escala)

    fig = plt.figure(figsize=(8,6))
    ax = plt.axes(projection=ccrs.PlateCarree())
    ax.set_extent([lon_min, lon_max, lat_min, lat_max], crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.COASTLINE)
    ax.add_feature(cfeature.BORDERS, linestyle=":")

    if escala == "redondeada":
        bins = ESCALAS[grupo]["redondeada"]
        # Colores sólidos para cada rango
        cmap = mcolors.ListedColormap([
            "#0000ff", "#00ffff", "#00ff00", "#ffff00",
            "#ff9900", "#ff0000", "#9900ff"
        ])
        norm = mcolors.BoundaryNorm(bins, cmap.N)

        im = ax.pcolormesh(data.longitude, data.latitude, data.values,
                           cmap=cmap, norm=norm, transform=ccrs.PlateCarree())
        plt.colorbar(im, ax=ax, orientation="horizontal", pad=0.05,
                     boundaries=bins, ticks=bins)
    else:
        im = ax.pcolormesh(data.longitude, data.latitude, valores,
                           cmap="viridis", transform=ccrs.PlateCarree())
        plt.colorbar(im, ax=ax, orientation="horizontal", pad=0.05,)
    print("Guardando mapa en:", outpath)
    plt.savefig(outpath, dpi=150, bbox_inches="tight", pad_inches=0)
    plt.close()
'''
def plot_viento(ds, dominio, outpath, grupo="Cuba"):
    lat_min, lat_max, lon_min, lon_max = dominio
    u = ds["u"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))
    v = ds["v"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))

    fig = plt.figure(figsize=(8,6))
    ax = plt.axes(projection=ccrs.PlateCarree())
    ax.set_extent([lon_min, lon_max, lat_min, lat_max], crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.COASTLINE)
    ax.add_feature(cfeature.BORDERS, linestyle=":")

    if grupo == "MaresAdyacentes":
        print('asdasd')
        step = 8  # prueba con 8 o 10 para reducir bastante
        lon = u.longitude.values[::step]
        lat = u.latitude.values[::step]
        uu = u.values[::step, ::step]
        vv = v.values[::step, ::step]
        ax.barbs(lon, lat, uu, vv, transform=ccrs.PlateCarree(), length=5)
    else:
        ax.barbs(u.longitude, u.latitude, u.values, v.values,
                 transform=ccrs.PlateCarree(), length=6)

    plt.title(f"Viento ({grupo})")
    plt.savefig(outpath, dpi=150)
    plt.close()
    '''



def plot_leva(ds, dominio, outpath, modo="color"):
    lat_min, lat_max, lon_min, lon_max = dominio
    data = ds["shts"].sel(orderedSequenceData=1,
                          latitude=slice(lat_max, lat_min),
                          longitude=slice(lon_min, lon_max))
    u = ds["u"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))
    v = ds["v"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))

    fig = plt.figure(figsize=(8,6))
    ax = plt.axes(projection=ccrs.PlateCarree())
    ax.set_extent([lon_min, lon_max, lat_min, lat_max], crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.COASTLINE)
    ax.add_feature(cfeature.BORDERS, linestyle=":")
    '''
    if modo == "color":
        im = ax.pcolormesh(data.longitude, data.latitude, data.values, cmap="plasma", transform=ccrs.PlateCarree())
        plt.colorbar(im, ax=ax, orientation="horizontal", pad=0.05, label="Leva (m)")
    elif modo == "vectores":
        ax.barbs(u.longitude, u.latitude, u.values, v.values, transform=ccrs.PlateCarree(), length=6)'''
    if modo == "ambos":
        im = ax.pcolormesh(data.longitude, data.latitude, data.values, cmap="plasma", transform=ccrs.PlateCarree())
        plt.colorbar(im, ax=ax, orientation="horizontal", pad=0.05)
        ax.quiver(u.longitude, u.latitude, u.values, v.values, transform=ccrs.PlateCarree(), scale=400)
    print("Guardando mapa en:", outpath)
    plt.savefig(outpath, dpi=150, bbox_inches="tight", pad_inches=0)
    plt.close()

def plot_altura_viento(ds, dominio, outpath, grupo="Cuba"):
    factor = 1.94384
    lat_min, lat_max, lon_min, lon_max = dominio
    data = ds["swh"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))
    u = ds["u"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))*factor
    v = ds["v"].sel(latitude=slice(lat_max, lat_min), longitude=slice(lon_min, lon_max))*factor

    fig = plt.figure(figsize=(8,6))
    ax = plt.axes(projection=ccrs.PlateCarree())
    ax.set_extent([lon_min, lon_max, lat_min, lat_max], crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.COASTLINE)
    ax.add_feature(cfeature.BORDERS, linestyle=":")

    # Usar shading para suavizar la visualización
    im = ax.pcolormesh(data.longitude.values, data.latitude.values, data.values,
                       cmap="viridis", transform=ccrs.PlateCarree(), shading="gouraud")
    plt.colorbar(im, ax=ax, orientation="horizontal", pad=0.05,)

    # Barbs con submuestreo si es MaresAdyacentes
    if grupo == "MaresAdyacentes":
        step = 3
        lon = u.longitude.values[::step]
        lat = u.latitude.values[::step]
        uu = u.values[::step, ::step]
        vv = v.values[::step, ::step]
        ax.barbs(lon, lat, uu, vv, transform=ccrs.PlateCarree(), length=5)
    else:
        ax.barbs(u.longitude.values, u.latitude.values,
                 u.values, v.values,
                 transform=ccrs.PlateCarree(), length=6)
    print("Guardando mapa en:", outpath)
    plt.savefig(outpath, dpi=150, bbox_inches="tight", pad_inches=0)
    plt.close()

def plot_periodo(ds, outpath):
    # Dominio fijo: lat 19–23.5, lon -86 a -83 → 274 a 277
    lat_min, lat_max = 19.0, 24
    lon_min, lon_max = 274.0, 287.0

    data = ds["perpw"].sel(latitude=slice(lat_max, lat_min),
                           longitude=slice(lon_min, lon_max))

    fig = plt.figure(figsize=(8,6))
    ax = plt.axes(projection=ccrs.PlateCarree())
    ax.set_extent([lon_min, lon_max, lat_min, lat_max], crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.COASTLINE)
    ax.add_feature(cfeature.BORDERS, linestyle=":")

    im = ax.pcolormesh(data.longitude.values, data.latitude.values, data.values,
                       cmap="plasma", transform=ccrs.PlateCarree(), shading="auto")
    plt.colorbar(im, ax=ax, orientation="horizontal", pad=0.05)
    print("Guardando mapa en:", outpath)
    plt.savefig(outpath, dpi=150, bbox_inches="tight", pad_inches=0)
    plt.close()





def main():
    for item in os.listdir(MAPAS_DIR):
        item_path = os.path.join(MAPAS_DIR, item)
        
        # Si es una carpeta, la elimina con todo su contenido
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
            print(f"Carpeta eliminada: {item_path}")
    files = sorted(glob.glob(os.path.join(BASE_DIR, "*.grib2")))
    for f in files:
        ds = xr.open_dataset(f, engine="cfgrib")
        nombre_archivo = generar_nombre(ds)

        for grupo, subdoms in DOMINIOS.items():
            for subdom, limites in subdoms.items():
                # Escalas según grupo
                if grupo == "Cuba":
                    escalas = ["redondeada"]
                else:  # MaresAdyacentes
                    escalas = ["redondeada"]

                # Altura significativa con todas las escalas válidas
                for escala in escalas:
                    outdir = os.path.join(MAPAS_DIR, grupo, subdom, "AlturaSignificativa", escala)
                    os.makedirs(outdir, exist_ok=True)
                    outpath = os.path.join(outdir, nombre_archivo)
                    plot_altura(ds, limites, outpath, grupo, escala=escala)

                # Viento
                outdir = os.path.join(MAPAS_DIR, grupo, subdom, "Viento")
                os.makedirs(outdir, exist_ok=True)
                outpath = os.path.join(outdir, nombre_archivo)

                # Leva en sus tres variantes
                for modo in ["ambos"]:
                    outdir = os.path.join(MAPAS_DIR, grupo, subdom, "Leva", modo)
                    os.makedirs(outdir, exist_ok=True)
                    outpath = os.path.join(outdir, nombre_archivo)
                    plot_leva(ds, limites, outpath, modo=modo)

                # Altura significativa + Viento
                outdir = os.path.join(MAPAS_DIR, grupo, subdom, "AlturaSignificativaViento")
                os.makedirs(outdir, exist_ok=True)
                outpath = os.path.join(outdir, nombre_archivo)
                plot_altura_viento(ds, limites, outpath, grupo=grupo)

                # Periodo de pico de la ola
                outdir = os.path.join(MAPAS_DIR, "Periodo")
                os.makedirs(outdir, exist_ok=True)
                outpath = os.path.join(outdir, nombre_archivo)
                plot_periodo(ds, outpath)


        ds.close()


if __name__ == "__main__":
    main()

