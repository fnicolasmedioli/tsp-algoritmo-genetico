import math
import random
import json

from archivo_atsp import ArchivoATSP
from cromosoma import Cromosoma

import datetime

def chequear_config(config):
    assert config["hijos_generados_por_iteracion"] >= config["tamano_recambio_generacional"], \
        "El tamano del recambio generacional no puede ser mayor al numero de hijos generados por generacion"


class SolucionadorATSP:

    def __init__(self, archivo: ArchivoATSP, config: dict, timestamp_inicio):

        self._archivo = archivo
        self._config = config
        self._matriz = archivo.get_matriz()
        chequear_config(config)
        self._mejor_cromosoma = None
        self._historial_mejores = []
        self._poblacion = None
        self._generacion_actual = 0
        self._timestamp_inicio = timestamp_inicio
        
        if config["metodo_seleccion_padres"] == "ruleta":
            self.seleccionar_pareja = seleccionar_pareja_por_ruleta
        else:
            self.seleccionar_pareja = seleccionar_pareja_por_torneo

        if config["metodo_cruzamiento"] == "order_crossover":
            self.cruzar_pareja = cruzar_pareja_por_order_crossover
        else:
            self.cruzar_pareja = cruzar_pareja_por_position_based_crossover



    def ejecutar(self, control_ejecucion):

        print("Inicia la ejecucion")

        self._generar_poblacion_inicial()

        # Encontrar mejor cromosoma de la poblacion inicial

        for cromosoma in self._poblacion:
            if self._mejor_cromosoma is None or self._mejor_cromosoma.get_fitness() < cromosoma.get_fitness():
                self._mejor_cromosoma = cromosoma

        self._historial_mejores.append({
            "cromosoma": self._mejor_cromosoma,
            "generacion": 0,
            "segundos": (datetime.datetime.now() - self._timestamp_inicio).total_seconds()
        })

        while control_ejecucion["ejecutar"]:

            self._generacion_actual += 1

            self._poblacion = sorted(self._poblacion, key=Cromosoma.get_fitness, reverse=True)

            lista_hijos = []

            for hijo in range(math.floor(self._config["hijos_generados_por_iteracion"] / 2)):
                pareja = self.seleccionar_pareja(self._poblacion)

                hijos = self.cruzar_pareja(pareja, self._matriz)

                #if not chequear_validez(hijos[0]) or not chequear_validez(hijos[1]):
                #    print("SE GENERARON HIJOS INVALIDOS")

                if len(hijos[0].get_genes()) != self._archivo.get_dimension():
                    raise Exception(
                        "Se perdieron/ganaron: " + str(abs(self._archivo.get_dimension() - len(hijos[0].get_genes()))) +
                        " genes en el cruce")

                lista_hijos.append(hijos[0])
                lista_hijos.append(hijos[1])

            # Generar mutaciones

            for hijo in lista_hijos:

                if random.random() < self._config["probabilidad_mutacion"]:

                    if self._config["metodo_mutacion"] == "intercambio":
                        hijo.mutar_por_intercambio()
                    else:
                        hijo.mutar_por_inversion()

                    hijo.set_costo(self._calcular_costo(hijo.get_genes()))

            # Recambio generacional

            self._poblacion = sorted(self._poblacion, key=Cromosoma.get_fitness, reverse=True)
            lista_hijos = sorted(lista_hijos, key=Cromosoma.get_fitness, reverse=True)

            self._poblacion = self._poblacion[:len(self._poblacion) - self._config["tamano_recambio_generacional"]] + \
                              lista_hijos[:self._config["tamano_recambio_generacional"]]

            # Chequear y actualizar el mejor cromosoma encontrado

            if self._mejor_cromosoma is None or self._mejor_cromosoma.get_fitness() < self._poblacion[0].get_fitness():
                self._mejor_cromosoma = self._poblacion[0]

                self._historial_mejores.append({
                    "cromosoma": self._mejor_cromosoma,
                    "generacion": self._generacion_actual,
                    "segundos": (datetime.datetime.now() - self._timestamp_inicio).total_seconds()
                })

        print("Finaliza la ejecucion")


    def _generar_poblacion_inicial(self):

        self._poblacion = []

        for i in range(self._config["tamano_poblacion"]):
            cromosoma = self._generar_cromosoma_aleatorio()
            self._poblacion.append(cromosoma)

    def _calcular_costo(self, genes):

        return calcular_costo_cromosoma(genes, self._matriz)

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

        costo = self._calcular_costo(genes)

        return Cromosoma(genes, costo)

    def get_poblacion(self):

        if self._poblacion is None:
            return None

        lista = []
        for cromosoma in self._poblacion:
            lista.append(cromosoma.to_json())
        return lista

    def get_mejor_cromosoma(self):
        return self._mejor_cromosoma

    def get_historial_mejores(self):
        lista = []
        for mejora in self._historial_mejores:
            lista.append({
                "cromosoma": mejora["cromosoma"].to_json(),
                "generacion": mejora["generacion"],
                "segundos": mejora["segundos"]
            })
        return lista

    def get_mejor_cromosoma_json(self):
        if self._mejor_cromosoma is None:
            return None
        return self._mejor_cromosoma.to_json()

    def get_generacion_actual(self):
        return self._generacion_actual




def seleccionar_pareja_por_torneo(poblacion):

    def seleccionar_padre_aletoriamente():

        indice_aleatorio_1 = random.randint(0, len(poblacion) - 1)
        indice_aleatorio_2 = None

        while True:
            indice_aleatorio_2 = random.randint(0, len(poblacion) - 1)
            if indice_aleatorio_2 != indice_aleatorio_1:
                break

        if poblacion[indice_aleatorio_1].get_fitness() > poblacion[indice_aleatorio_2].get_fitness():
            return poblacion[indice_aleatorio_1]
        else:
            return poblacion[indice_aleatorio_2]

    padre_1 = seleccionar_padre_aletoriamente()
    padre_2 = None

    while True:
        padre_2 = seleccionar_padre_aletoriamente()
        if padre_2 != padre_1:
            break

    return padre_1, padre_2


def seleccionar_pareja_por_ruleta(poblacion):
        
        def calcular_suma_fitness(poblacion):
            suma = 0
            for cromosoma in poblacion:
                suma += cromosoma.get_fitness()
            return suma

        def calcular_probabilidad(cromosoma, suma_fitness):
            return cromosoma.get_fitness() / suma_fitness

        suma_fitness = calcular_suma_fitness(poblacion)
        
        acumulador = 0

        rand_padre_1 = random.random()
        rand_padre_2 = random.random()

        padre1 = None
        padre2 = None

        for cromosoma in poblacion:
            acumulador += calcular_probabilidad(cromosoma, suma_fitness)
            
            if padre1 is None and rand_padre_1 <= acumulador:
                padre1 = cromosoma

            if padre2 is None and rand_padre_2 <= acumulador:
                padre2 = cromosoma

            if padre1 and padre2:
                break

        return padre1, padre2


def cruzar_pareja_por_order_crossover(pareja, matriz):

    dimension = pareja[0].get_length()

    def cruzar_por_rango(genes_padre_1, genes_padre_2, rango):

        copia_genes_padre_2 = genes_padre_2.copy()
        genes_hijo = []

        ciudades_en_rango = genes_padre_1[rango["inicio"]: rango["fin"]]

        for i in range(len(copia_genes_padre_2) - 1, -1, -1):
            if copia_genes_padre_2[i] in ciudades_en_rango:
                del copia_genes_padre_2[i]

        genes_hijo += copia_genes_padre_2[:rango["inicio"]]
        genes_hijo += genes_padre_1[rango["inicio"]: rango["fin"]]
        genes_hijo += copia_genes_padre_2[rango["inicio"]:]

        return genes_hijo

    genes_padre_1 = pareja[0].get_genes()
    genes_padre_2 = pareja[1].get_genes()

    inicio_rango = random.randint(0, dimension - 1)
    fin_rango = random.randint(0, dimension - 1)

    if fin_rango < inicio_rango:
        inicio_rango, fin_rango = fin_rango, inicio_rango

    rango = {"inicio": inicio_rango, "fin": fin_rango}

    genes_hijo_1 = cruzar_por_rango(genes_padre_1, genes_padre_2, rango)
    genes_hijo_2 = cruzar_por_rango(genes_padre_2, genes_padre_1, rango)

    costo_hijo_1 = calcular_costo_cromosoma(genes_hijo_1, matriz)
    costo_hijo_2 = calcular_costo_cromosoma(genes_hijo_2, matriz)

    return Cromosoma(genes_hijo_1, costo_hijo_1), Cromosoma(genes_hijo_2, costo_hijo_2)



def cruzar_pareja_por_position_based_crossover(pareja, matriz):

    dimension = pareja[0].get_length()

    def cruzar_aleatoriamente(genes_padre_1, genes_padre_2, seleccionados):

        copia_genes_padre_2 = genes_padre_2.copy()
        genes_hijo = []

        ciudades_seleccionadas = []
        for i in seleccionados:
            ciudades_seleccionadas.append(genes_padre_1[i])

        for i in range(len(copia_genes_padre_2) - 1, -1, -1):
            if copia_genes_padre_2[i] in ciudades_seleccionadas:
                del copia_genes_padre_2[i]

        for i in range(dimension):
            if i in seleccionados:
                genes_hijo.append(genes_padre_1[i])
            else:
                genes_hijo.append(copia_genes_padre_2.pop(0))

        return genes_hijo

    seleccionados = []

    for _ in range(random.randint(1, dimension - 1)):

        indice = random.randint(0, dimension - 1)

        if not indice in seleccionados:
            seleccionados.append(indice)

    genes_padre_1 = pareja[0].get_genes()
    genes_padre_2 = pareja[1].get_genes()

    genes_hijo_1 = cruzar_aleatoriamente(genes_padre_1, genes_padre_2, seleccionados)
    genes_hijo_2 = cruzar_aleatoriamente(genes_padre_2, genes_padre_1, seleccionados)

    costo_hijo_1 = calcular_costo_cromosoma(genes_hijo_1, matriz)
    costo_hijo_2 = calcular_costo_cromosoma(genes_hijo_2, matriz)

    return Cromosoma(genes_hijo_1, costo_hijo_1), Cromosoma(genes_hijo_2, costo_hijo_2)


def calcular_costo_cromosoma(genes, matriz):

    costo = 0

    for i in range(len(genes) - 1):
        costo += matriz[genes[i]][genes[i + 1]]

    costo += matriz[genes[len(genes) - 1]][genes[0]]  # Agregar costo para cerrar el ciclo

    return costo


def chequear_validez(cromosoma):
    genes = cromosoma.get_genes()
    for i in range(len(genes)):
        for j in range(i + 1, len(genes)):
            if genes[i] == genes[j]:
                return False
    return True