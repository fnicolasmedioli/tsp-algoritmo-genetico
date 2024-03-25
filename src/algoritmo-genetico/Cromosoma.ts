import ATSPMatrix from '../ATSPMatrix';
import { MutacionFn } from './Mutaciones';

class Cromosoma {

    static CromosomaAleatorio: (dimension: number, matrix: ATSPMatrix) => Cromosoma;

    private genes: number[];
    private matrix: ATSPMatrix;
    private costo: number | null;

    constructor(genes: number[], matrix: ATSPMatrix) {
        this.genes = genes;
        this.matrix = matrix;
        this.costo = null;
    }

    public mutar(mutacion: MutacionFn): void {
        mutacion(this.genes);
        this.costo = this.calcularCosto();
    }

    private calcularCosto(): number {

        let sumador = 0;

        for (let i = 0; i < this.genes.length - 1; i++) {
            sumador += this.matrix.getCosto(this.genes[i], this.genes[i + 1]);
        }
        sumador += this.matrix.getCosto(this.genes[this.genes.length - 1], this.genes[0]);

        return sumador;
    }

    public getCosto(): number {

        if (this.costo == null)
            this.costo = this.calcularCosto();

        return this.costo;
    }

    public getFitness(): number {
        return 1 / this.getCosto();
    }

    public getCopia(): Cromosoma {
        return new Cromosoma([...this.genes], this.matrix);
    }

    public getGenes(): number[] {
        return this.genes;
    }
}

Cromosoma.CromosomaAleatorio = (dimension: number, matrix: ATSPMatrix) => {

    const genesTemp = [];
    const genes = [];

    for (let i = 0; i < dimension; i++) {
        genesTemp.push(i);
    }

    for (let i = 0; i < genesTemp.length; i++) {
        const randomIndex = Math.floor(Math.random() * genesTemp.length);
        const temp: number = genesTemp[randomIndex];
        genesTemp[randomIndex] = genesTemp[genesTemp.length - 1];
        genesTemp.pop();
        genes.push(temp);
    }

    return new Cromosoma(genes, matrix);
};

export default Cromosoma;