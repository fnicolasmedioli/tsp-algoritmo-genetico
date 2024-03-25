import ATSPMatrix from "../ATSPMatrix";
import { Mejora, ProgramConfig } from "../types";
import Poblacion from "./Poblacion";

export default class SolucionATSP {

    private programConfig: ProgramConfig;
    private matrix: ATSPMatrix;

    private poblacion: Poblacion;
    private mejoras: Array<Mejora>;

    constructor(programConfig: ProgramConfig, matrix: ATSPMatrix) {
        this.programConfig = programConfig;
        this.matrix = matrix;        
        this.poblacion = new Poblacion(programConfig, matrix);
        this.mejoras = [];
    }

    public run() {

        this.poblacion.generarPoblacionInicial();

        this.mejoras.push({
            iteracion: 0,
            cromosoma: this.poblacion.getMejorCromosoma()
        });
        
        for (let n_iteracion = 1; n_iteracion <= 500; n_iteracion++)
        {

            

        }

    }

}