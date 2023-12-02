import random


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
        return {
            "fitness": self._fitness,
            "genes": self._genes,
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

    def mutar_genes(self):

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

    def set_costo(self, costo):
        self._costo = costo
        self._fitness = self._calc_fitness(costo)

    def _calc_fitness(self, costo):
        self._fitness = 1 / costo
        return self._fitness


# Se usa esta funcion para ordenar la lista de cromosomas por fitness
def get_fitness(cromosoma):
    return cromosoma.get_fitness()
