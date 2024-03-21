import IMutacion from './IMutacion';

class Cromosoma {

    private genes: number[];
    private costo: number;

    constructor(genes: number[], matrizCostos: number[][]) {
        this.genes = genes;
        this.costo = this.calcularCosto(matrizCostos);
    }

    public mutar(mutacion: IMutacion): void {
        mutacion.mutarGenes(this.genes);
    }

    private calcularCosto(matrizCostos: number[][]): number {
        let sumador = 0;
        for (let i = 0; i < this.genes.length - 1; i++) {
            sumador += matrizCostos[this.genes[i]][this.genes[i + 1]];
        }
        sumador += matrizCostos[this.genes[this.genes.length - 1]][this.genes[0]];
        return sumador;
    }

    public getCosto(): number {
        return this.costo;
    }

}

export default Cromosoma;