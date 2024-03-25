import ATSPMatrix from "../ATSPMatrix";
import { ProgramConfig } from "../types";
import Cromosoma from "./Cromosoma";

export default class Poblacion {
 
    private programConfig: ProgramConfig;
    private matrix: ATSPMatrix;

    private poblacion: Array<Cromosoma>;

    constructor(programConfig: ProgramConfig, matrix: ATSPMatrix) {

        this.programConfig = programConfig;
        this.matrix = matrix;
        this.poblacion = [];
    }

    public generarPoblacionInicial() {

        this.poblacion = [];

        for (let i = 0; i < this.programConfig.tamano_poblacion; i++) {

            const cromosoma = Cromosoma.CromosomaAleatorio(this.matrix.getDimension(), this.matrix);
            this.poblacion.push(cromosoma);
        }
    }

    private ordenarPoblacion() {
        this.poblacion.sort((a, b) => b.getFitness() - a.getFitness());
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

        // Actualizar mejor cromosoma por posibles mutaciones

        this.ordenarPoblacion();

        return this.poblacion[0];
    }

    public recambioGeneracional(hijos: Array<Cromosoma>) {

        this.ordenarPoblacion();
        hijos.sort((a, b) => b.getFitness() - a.getFitness());

        this.poblacion = this.poblacion.slice(0, this.poblacion.length - this.programConfig.tamano_recambio_generacional);
        this.poblacion = this.poblacion.concat(hijos.slice(0, this.programConfig.tamano_recambio_generacional));
    }

}