import random
import math

class Cromosoma:

    _genes = None
    _costo = None
    _fitness = None

    def __init__(self, genes, costo):
        self._genes = genes
        self._costo = costo
        self._fitness = self._calc_fitness(costo)

    def _get_genes_str(self):
        s = str(self._genes[0])
        for i in range(1, len(self._genes)):
            s += ", " + str(self._genes[i])
        s += ", " + str(self._genes[0])
        return s

    def to_json(self):
        g = self._genes.copy()
        if len(g) > 0:
            g.append(g[0])
        return {
            "fitness": self._fitness,
            "genes": g,
            "costo": self._costo
        }

    def __repr__(self):
        return "Fitness: " + str(self._fitness) + " Genes: " + self._get_genes_str() + " Costo: " + str(self._costo)

    def get_genes(self):
        return self._genes

    def get_fitness(self):
        return self._fitness

    def get_costo(self):
        return self._costo
    
    def get_length(self):
        return len(self._genes)

    def mutar_por_intercambio(self):

        tamano_inicial = len(self._genes)

        indice_gen = random.randint(0, len(self._genes) - 1)
        indice_gen_intercambio = None

        while True:
            indice_gen_intercambio = random.randint(0, len(self._genes) - 1)
            if indice_gen_intercambio != indice_gen:
                break

        if indice_gen > indice_gen_intercambio:
            indice_gen, indice_gen_intercambio = indice_gen_intercambio, indice_gen

        temp = self._genes[indice_gen]
        self._genes[indice_gen] = self._genes[indice_gen_intercambio]
        self._genes[indice_gen_intercambio] = temp

        if len(self._genes) < tamano_inicial:
            raise Exception("Se perdieron genes en la mutacion")

        self._fitness = None


    def mutar_por_inversion(self):

        a = random.randint(0, len(self._genes) - 1)
        b = None

        while True:
            b = random.randint(0, len(self._genes) - 1)
            if a != b:
                break

        if a > b:
            a, b = b, a

        cantidad_genes_afectados = b - a + 1

        for i in range(math.floor(cantidad_genes_afectados / 2)):
            self._genes[a + i], self._genes[b - i] = self._genes[b - i], self._genes[a + i]

        self._fitness = None
    

    def set_costo(self, costo):
        self._costo = costo
        self._fitness = self._calc_fitness(costo)

    def _calc_fitness(self, costo):
        self._fitness = 1 / costo
        return self._fitness


# Se usa esta funcion para ordenar la lista de cromosomas por fitness
def get_fitness(cromosoma):
    return cromosoma.get_fitness()
