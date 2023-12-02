import matplotlib
import matplotlib.pyplot as plt
import threading
import os
from flask import Flask, send_from_directory, request
import json
import datetime

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
timestamp_inicio = None


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
def handle_iniciar():
    global config
    global solucionador
    global timestamp_inicio

    if control_ejecucion["ejecutar"]:
        return "No se puede ejecutar mas de una instancia a la vez", 503

    timestamp_inicio = datetime.datetime.now()
    config = None

    try:
        config = json.loads(request.data)
    except:
        return "No se pudo parsear el json", 400

    archivo = ArchivoATSP(f"./data/{config['nombre_archivo']}")

    solucionador = SolucionadorATSP(
        archivo,
        config
    )

    control_ejecucion["ejecutar"] = True

    def ejecucion_concurrente():        
        solucionador.ejecutar(control_ejecucion)

    threading.Thread(target=ejecucion_concurrente).start()

    return "", 204


@app.route("/parar", methods=["POST"])
def handle_parar():
    global solucionador
    global timestamp_inicio

    if not control_ejecucion["ejecutar"]:
        return "No hay ninguna ejecucion en curso", 503

    control_ejecucion["ejecutar"] = False

    historial_mejores = solucionador.get_historial_mejores()

    datos = {
        "mejor_cromosoma": solucionador.get_mejor_cromosoma_json(),
        "historial_mejores": historial_mejores,
        "ruta_grafico": "temp.png",
        "poblacion": solucionador.get_poblacion(),
        "segundos_ejecucion": (datetime.datetime.now() - timestamp_inicio).total_seconds(),
        "config": config
    }

    solucionador = None
    timestamp_inicio = None

    eje_x = [mejora["generacion"] for mejora in historial_mejores]
    eje_y = [mejora["cromosoma"]["costo"] for mejora in historial_mejores]

    plt.close()
    plt.figure()
    plt.xscale("log")
    plt.plot(eje_x, eje_y, label="Mejor solucion encontrada por generacion")
    plt.savefig("./public/temp.png")
    plt.clf()

    return json.dumps(datos), 200


@app.route("/estado", methods=["POST"])
def handle_estado():

    if solucionador is None:
        return { "ejecutando": False }

    return {
        "ejecutando": True,
        "poblacion": solucionador.get_poblacion(),
        "mejor_cromosoma": solucionador.get_mejor_cromosoma_json(),
        "historial_mejores": solucionador.get_historial_mejores(),
        "generacion_actual": solucionador.get_generacion_actual()
    }