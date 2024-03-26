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
        while (!lines[matrixStartLine].startsWith("EDGE_WEIGHT_SECTION") && matrixStartLine < lines.length)
            matrixStartLine++;
        matrixStartLine++;

        if (matrixStartLine >= lines.length)
            throw new Error("Invalid ATSP file.");

        let currentLine = matrixStartLine;

        while (!lines[currentLine].startsWith("EOF"))
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