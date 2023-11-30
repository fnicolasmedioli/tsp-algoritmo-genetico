class Cromosoma:

    genes = None
    fitness = None

    def __init__(self, genes, fitness):
        self.genes = genes
        self.fitness = fitness

    def __repr__(self):
        return "Genes: " + str(self.genes) + "  Fitness: " + str(self.fitness)

    def get_genes(self):
        return self.genes

    def get_fitness(self):
        return self.fitness


# Se usa esta funcion para ordenar la lista de cromosomas por fitness
def get_fitness(cromosoma):
    return cromosoma.get_fitness()