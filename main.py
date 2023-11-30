import random

import cromosoma
from archivo_atsp import ArchivoATSP
from solucionador_atsp import SolucionadorATSP


def main():

    archivo = ArchivoATSP("./data/br17.atsp")
    solucionador = SolucionadorATSP(
        archivo,
        {
            "tamano_poblacion": 50,
            "tamano_recambio_generacional": 10,
        }
    )

    solucionador.ejecutar()

    print(solucionador.get_poblacion())

    print(sorted(solucionador.get_poblacion(), key=cromosoma.get_fitness, reverse=True))


    #print(solucionador._seleccionar_pareja_por_torneo())


if __name__ == "__main__":
    main()