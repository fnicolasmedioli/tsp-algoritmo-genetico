import random
from archivo_atsp import ArchivoATSP


def generar_solucion_aleatoria(dimension):

    ciudades_restantes = []
    solucion = []

    for i in range(dimension):
        ciudades_restantes.append(i)

    while len(ciudades_restantes) > 0:

        indice_ciudad_aleatoria = random.randint(0, len(ciudades_restantes)-1)
        ciudad_aleatoria = ciudades_restantes[indice_ciudad_aleatoria]
        solucion.append(ciudad_aleatoria)

        if len(ciudades_restantes) >= 2:
            ciudades_restantes[indice_ciudad_aleatoria] = ciudades_restantes[len(ciudades_restantes)-1]

        ciudades_restantes.pop()

    solucion.append(solucion[0])

    return solucion


def main():

    archivo = ArchivoATSP("./data/br17.atsp")
    matriz = archivo.get_matriz()
    dimension = archivo.get_dimension()

    print(generar_solucion_aleatoria(dimension))
    print(generar_solucion_aleatoria(dimension))


if __name__ == "__main__":
    main()