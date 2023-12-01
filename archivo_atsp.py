class ArchivoATSP:

    _nombre = None
    _dimension = None
    _matriz = None

    def __init__(self, nombre_archivo):
        self.cargar_archivo(nombre_archivo)

    def cargar_archivo(self, nombre_archivo):

        with open(nombre_archivo, "r") as archivo:

            for linea in archivo:

                if linea.startswith("NAME: "):
                    self._nombre = linea[5:].strip()

                if linea.startswith("DIMENSION: "):
                    self._dimension = int(linea[10:].strip())

                if linea.startswith("EDGE_WEIGHT_SECTION"):

                    self._matriz = []

                    for i in range(self._dimension):

                        linea = archivo.readline()
                        linea = linea.strip()
                        linea = linea.split(" ")
                        linea = _eliminar_vacios(linea)
                        linea = list(map(int, linea))
                        self._matriz.append(linea)

    def get_nombre(self):
        return self._nombre

    def get_dimension(self):
        return self._dimension

    def get_matriz(self):
        return self._matriz


def _eliminar_vacios(arr):
    return [x for x in arr if x != ""]
