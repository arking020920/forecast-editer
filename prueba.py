import xarray as xr

# Ruta al archivo GRIB2
file_path = r"D:\Armin\Salva Diaria\forecast-editer\forecast-editer\datos\gfs-wave\000.gfs.wave.extension.grib2"

# Abrir el archivo con cfgrib
ds = xr.open_dataset(file_path, engine="cfgrib")

# Mostrar las variables disponibles
print("Variables en el archivo:")
print(ds)

# Acceder a una variable específica, por ejemplo altura significativa de ola (htsgwsfc)
if "htsgwsfc" in ds.variables:
    hsig = ds["htsgwsfc"]
    print("\nAltura significativa de ola:")
    print(hsig)

    # Puedes acceder a los valores como numpy array
    valores = hsig.values
    print("Dimensiones:", valores.shape)
    print("Ejemplo de valores:", valores[0, :10])

# Otra forma: listar todas las variables
print("\nLista de variables:")
for var in ds.variables:
    print(var)

# Cerrar dataset
ds.close()
