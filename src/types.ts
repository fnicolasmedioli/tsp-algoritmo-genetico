import Cromosoma from "./algoritmo-genetico/Cromosoma";

import * as Cruzamientos from "./algoritmo-genetico/Cruzamientos";
import * as SeleccionPadres from "./algoritmo-genetico/SeleccionPadres";
import * as Mutaciones from "./algoritmo-genetico/Mutaciones";

export type ProgramConfig = {
    tamano_poblacion: number,
    hijos_generados_por_iteracion: number,
    tamano_recambio_generacional: number,
    probabilidad_mutacion: number,
    select_padres: SeleccionPadres.SeleccionPadresFn,
    select_cruzamiento: Cruzamientos.CruzamientoFn,
    select_mutacion: Mutaciones.MutacionFn
};

export type Mejora = {
    iteracion: number,
    cromosoma: Cromosoma,
    deltaTime: number
};