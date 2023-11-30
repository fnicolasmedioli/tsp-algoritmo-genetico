import random

from cromosoma import Cromosoma


class SolucionadorATSP:
    _archivo = None
    _config = None
    _poblacion = None
    _matriz = None

    def __init__(self, archivo, config):
        self._archivo = archivo
        self._config = config
        self._matriz = archivo.get_matriz()

    def ejecutar(self):

        self._generar_poblacion_inicial()

        generacion = 0

        while True:

            generacion += 1

            self._poblacion = sorted(self._poblacion, key=Cromosoma.get_fitness, reverse=True)

            lista_hijos = []

            for hijo in self._config["tamano_recambio_generacional"]:
                padre_1, padre_2 = self._seleccionar_pareja_por_torneo()

            if generacion == 100:
                break

    def _generar_poblacion_inicial(self):

        self._poblacion = []

        for i in range(self._config["tamano_poblacion"]):
            cromosoma = self._generar_cromosoma_aleatorio()
            self._poblacion.append(cromosoma)

    def _calcular_fitness(self, cromosoma):

        fitness = 0

        for i in range(len(cromosoma) - 1):
            fitness += self._matriz[cromosoma[i]][cromosoma[i + 1]]

        return 10000 / fitness

    def _generar_cromosoma_aleatorio(self):

        ciudades_restantes = []
        genes = []

        for i in range(self._archivo.get_dimension()):
            ciudades_restantes.append(i)

        while len(ciudades_restantes) > 0:

            indice_ciudad_aleatoria = random.randint(0, len(ciudades_restantes) - 1)
            ciudad_aleatoria = ciudades_restantes[indice_ciudad_aleatoria]
            genes.append(ciudad_aleatoria)

            if len(ciudades_restantes) >= 2:
                ciudades_restantes[indice_ciudad_aleatoria] = ciudades_restantes[len(ciudades_restantes) - 1]

            ciudades_restantes.pop()

        genes.append(genes[0])

        fitness = self._calcular_fitness(genes)

        return Cromosoma(genes, fitness)

    def _seleccionar_pareja_por_torneo(self):

        def seleccionar_padre_aletoriamente():

            indice_aleatorio_1 = random.randint(0, len(self._poblacion) - 1)
            indice_aleatorio_2 = None

            while True:
                indice_aleatorio_2 = random.randint(0, len(self._poblacion) - 1)
                if indice_aleatorio_2 != indice_aleatorio_1:
                    break

            if self._poblacion[indice_aleatorio_1].get_fitness() > self._poblacion[indice_aleatorio_2].get_fitness():
                return self._poblacion[indice_aleatorio_1]
            else:
                return self._poblacion[indice_aleatorio_2]

        padre_1 = seleccionar_padre_aletoriamente()
        padre_2 = None

        while True:
            padre_2 = seleccionar_padre_aletoriamente()
            if padre_2 != padre_1:
                break

        return padre_1, padre_2

    def _cruzar_pareja(self, pareja):

        pass

    def get_poblacion(self):
        return self._poblacion
