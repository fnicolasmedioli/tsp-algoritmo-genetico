import * as Plotly from 'plotly.js-dist-min';

import ATSPMatrix from "../ATSPMatrix";
import { Mejora, ProgramConfig } from "../types";
import Poblacion from "./Poblacion";

export default class SolucionATSP {

    private programConfig: ProgramConfig;

    private poblacion: Poblacion;
    private mejoras: Array<Mejora>;
    private stopped: boolean;

    private timestampInicio: number | null;

    constructor(programConfig: ProgramConfig, matrix: ATSPMatrix) {
        this.programConfig = programConfig;
        this.poblacion = new Poblacion(programConfig, matrix);
        this.mejoras = [];
        this.stopped = false;
        this.timestampInicio = null;
    }

    public stop() {
        this.stopped = true;
    }

    public async run(setMejoras: (mejoras: Array<Mejora>) => void) {

        this.stopped = false;
        this.timestampInicio = Date.now();

        this.poblacion.generarPoblacionInicial();

        this.mejoras.push({
            iteracion: 0,
            cromosoma: this.poblacion.getMejorCromosoma(),
            deltaTime: Date.now() - this.timestampInicio
        });
        
        let n_iteracion = 0;

        while (!this.stopped)
        {
            await sleep(10);

            const hijos = this.poblacion.crearHijos();

            for (const hijo of hijos)
                if (Math.random() < this.programConfig.probabilidad_mutacion)
                    hijo.mutar(this.programConfig.select_mutacion);
            
            this.poblacion.recambioGeneracional(hijos);

            const nuevoMejorCromosoma = this.poblacion.getMejorCromosoma();

            if (nuevoMejorCromosoma.getCosto() < this.mejoras[this.mejoras.length - 1].cromosoma.getCosto()) {

                this.mejoras.push({
                    iteracion: n_iteracion,
                    cromosoma: nuevoMejorCromosoma,
                    deltaTime: Date.now() - this.timestampInicio
                });

                Plotly.newPlot("plotly-graph", [{
                    x: this.mejoras.map(m => m.iteracion),
                    y: this.mejoras.map(m => m.cromosoma.getCosto()),
                    type: 'scatter',
                    marker: {color: 'blue'},
                }]);

                setMejoras([...this.mejoras]);
            }

            n_iteracion++;
        }

    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}