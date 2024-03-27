export type MutacionFn = ((genes: number[]) => void) & { descripcion: string };

export const mutacionInversion: MutacionFn = (genes: number[]) => {

    let inicio = Math.floor(Math.random() * genes.length);
    let fin = Math.floor(Math.random() * genes.length);

    (inicio > fin) && ([inicio, fin] = [fin, inicio]);

    const subGenes = genes.slice(inicio, fin);
    subGenes.reverse();
    genes.splice(inicio, subGenes.length, ...subGenes);
};
mutacionInversion.descripcion = "Inversión";

export const mutacionIntercambio: MutacionFn = (genes: number[]) => {

    const i = Math.floor(Math.random() * genes.length);
    const j = Math.floor(Math.random() * genes.length);

    const aux = genes[i];
    genes[i] = genes[j];
    genes[j] = aux;
};
mutacionIntercambio.descripcion = "Intercambio";