import ATSPMatrix from "../ATSPMatrix";
import { ProgramConfig } from "../types";
import Cromosoma from "./Cromosoma";

export default class Poblacion {
 
    private programConfig: ProgramConfig;
    private matrix: ATSPMatrix;

    private poblacion: Array<Cromosoma>;
    private mejorCromosoma: Cromosoma | null;

    constructor(programConfig: ProgramConfig, matrix: ATSPMatrix) {

        this.programConfig = programConfig;
        this.matrix = matrix;
        this.poblacion = [];
        this.mejorCromosoma = null;
    }

    public generarPoblacionInicial() {

        this.poblacion = [];

        for (let i = 0; i < this.programConfig.tamano_poblacion; i++) {

            const cromosoma = Cromosoma.CromosomaAleatorio(this.programConfig.tamano_poblacion, this.matrix);
            this.poblacion.push(cromosoma);

            if (this.mejorCromosoma == null || this.mejorCromosoma.getFitness() < cromosoma.getFitness())
                this.mejorCromosoma = cromosoma;
        }
    }

    public crearHijos() {

        const hijos: Array<Cromosoma> = [];

        for (let i = 0; i < this.programConfig.hijos_generados_por_iteracion; i++) {

            const [padre1, padre2] = this.programConfig.select_padres(this.poblacion);

            const genesHijo = this.programConfig.select_cruzamiento(padre1.getGenes(), padre2.getGenes());
            const hijo = new Cromosoma(genesHijo, this.matrix);

            hijos.push(hijo);
        }

        return hijos;
    }

    public getMejorCromosoma() {
        return this.mejorCromosoma!;
    }
}