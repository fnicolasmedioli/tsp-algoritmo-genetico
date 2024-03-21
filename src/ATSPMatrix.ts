class ATSPMatrix {

    private matrix: number[][];
    private dimension: number;

    constructor(text: string) {
        this.matrix = this.parseText(text);
        this.dimension = this.matrix.length;
    }

    private parseText(text: string): number[][] {

        const matrix: number[][] = [];

        const lines = text.split('\n');

        let matrixStartLine = 0;
        while (lines[matrixStartLine] != "EDGE_WEIGHT_SECTION")
            matrixStartLine++;
        matrixStartLine++;

        let currentLine = matrixStartLine;

        while (lines[currentLine] != "EOF")
        {
            const line = lines[currentLine];
            const parsedLine = line.split(" ").filter(el => el != "").map((value) => parseInt(value));

            matrix.push(parsedLine);
            currentLine++;
        }

        return matrix;
    }

    public getCosto(a: number, b: number): number {
        return this.matrix[a][b];
    }

    public getDimension(): number {
        return this.dimension;
    }

}

export default ATSPMatrix;