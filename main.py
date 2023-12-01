import matplotlib
import matplotlib.pyplot as plt
import threading
import os
from flask import Flask, send_from_directory, request
import json

from archivo_atsp import ArchivoATSP
from solucionador_atsp import SolucionadorATSP

matplotlib.use('Agg')

app = Flask(__name__)
carpeta_publica = os.path.join(os.path.dirname(__file__), 'public')

config = None
control_ejecucion = {
    "ejecutar": False
}
solucionador = None

@app.route("/")
def handle_raiz():
    return send_from_directory(carpeta_publica, "index.html")


@app.route("/<path:subpath>")
def handle_archivos(subpath):
    ruta_completa = os.path.join(carpeta_publica, subpath)

    if os.path.isdir(ruta_completa):
        return send_from_directory(ruta_completa, 'index.html')
    else:
        return send_from_directory(carpeta_publica, subpath)

@app.route("/iniciar", methods=["POST"])
def iniciar():
    global config
    global solucionador

    if control_ejecucion["ejecutar"]:
        print("No se puede ejecutar mas de una instancia")
        return 'No se puede ejecutar mas de una instancia a la vez', 503

    post_data = json.loads(request.data)

    config = post_data["config"]
    nombre_archivo = post_data["nombre_archivo"]

    archivo = ArchivoATSP(f"./data/{nombre_archivo}")

    solucionador = SolucionadorATSP(
        archivo,
        config
    )

    def ejecucion_concurrente():
        control_ejecucion["ejecutar"] = True
        solucionador.ejecutar(control_ejecucion)

    threading.Thread(target=ejecucion_concurrente).start()

    return '', 204


@app.route("/parar", methods=["POST"])
def parar():

    if not control_ejecucion["ejecutar"]:
        print("No hay ninguna ejecucion en curso")
        return 'No hay ninguna ejecucion en curso', 503

    control_ejecucion["ejecutar"] = False

    datos = {
        "mejor_cromosoma": str(solucionador.get_mejor_cromosoma()),
        "historial_mejores": str(solucionador.get_historial_mejores()),
        "ruta_grafico": "/temp.png"
    }

    historial_mejores = solucionador.get_historial_mejores()

    eje_x = [mejora["generacion"] for mejora in historial_mejores]
    eje_y = [mejora["cromosoma"].get_costo() for mejora in historial_mejores]

    plt.xscale("log")
    plt.plot(eje_x, eje_y, label="Mejor solucion encontrada por generacion")

    plt.savefig("./public/temp.png")

    return json.dumps(datos), 200


"""
def hilo_mostrar_datos(solucionador: SolucionadorATSP, control_hilo: dict):
    while control_hilo["ejecutar"]:

        if not solucionador.esta_ejecutando():
            continue

        imprimir = ""

        imprimir += "Mejor solucion encontrada hasta el momento:\n"
        imprimir += str(solucionador.get_mejor_cromosoma()) + "\n\n"
        imprimir += "Poblacion actual:\n"

        poblacion = solucionador.get_poblacion()

        for cromosoma in poblacion:
            imprimir += str(cromosoma) + "\n"

        borrar_pantalla()
        print(imprimir)

        time.sleep(1)
"""