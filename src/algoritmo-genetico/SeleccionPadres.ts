import Cromosoma from "./Cromosoma";

export type SeleccionPadresFn = (poblacion: Array<Cromosoma>) => Array<Cromosoma>;

export const seleccionPadresRuleta: SeleccionPadresFn = (poblacion: Array<Cromosoma>) => {

    const fitnessTotal = poblacion.reduce((acc, cromosoma) => acc + cromosoma.getFitness(), 0);

    const probAcumulada: Array<number> = [];

    for (const cromosoma of poblacion) {

        const probabilidad = cromosoma.getFitness() / fitnessTotal;

        if (probAcumulada.length === 0)
            probAcumulada.push(probabilidad);
        else
            probAcumulada.push(probabilidad + probAcumulada[probAcumulada.length - 1]);
    }

    probAcumulada[probAcumulada.length - 1] = 1;

    const padres: Array<Cromosoma> = [];

    for (let padre = 0; padre < 2; padre++)
    {
        const r = Math.random();

        for (let i = 0; i < probAcumulada.length; i++)
            if (r < probAcumulada[i]) {
                padres.push(poblacion[i]);
                break;
            }
    }

    return padres;
};

export const seleccionPadresTorneo: SeleccionPadresFn = (poblacion: Array<Cromosoma>) => {

    const padres: Array<Cromosoma> = [];

    for (let padre = 0; padre < 2; padre++)
    {
        const i = Math.floor(Math.random() * poblacion.length);
        const j = Math.floor(Math.random() * poblacion.length);

        if (poblacion[i].getFitness() > poblacion[j].getFitness())
            padres.push(poblacion[i]);
        else
            padres.push(poblacion[j]);
    }

    return padres;    
};