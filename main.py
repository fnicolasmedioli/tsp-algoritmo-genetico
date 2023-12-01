from archivo_atsp import ArchivoATSP
from solucionador_atsp import SolucionadorATSP
from matplotlib import pyplot as plt
import threading
import os
import time


def borrar_pantalla():
    if os.name == "nt":
        os.system("cls")
    else:
        os.system("clear")


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


def main():
    archivo = ArchivoATSP("./data/p43.atsp")

    solucionador = SolucionadorATSP(
        archivo,
        {
            "tamano_poblacion": 100,
            "hijos_generados_por_iteracion": 30,
            "tamano_recambio_generacional": 10,
            "probabilidad_mutacion": 0.05
        }
    )

    control_hilo = {
        "ejecutar": True
    }

    hilo_datos = threading.Thread(target=hilo_mostrar_datos, args=(solucionador, control_hilo))
    hilo_datos.start()

    solucionador.ejecutar()

    control_hilo["ejecutar"] = False

    print("La mejor solucion encontrada es: ")
    print(solucionador.get_mejor_cromosoma())

    historial_mejores = solucionador.get_historial_mejores()

    eje_x = [mejora["generacion"] for mejora in historial_mejores]
    eje_y = [mejora["cromosoma"].get_costo() for mejora in historial_mejores]

    plt.xscale("log")
    plt.plot(eje_x, eje_y, label="Mejor solucion encontrada por generacion")
    plt.show()


if __name__ == "__main__":
    main()
