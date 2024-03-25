export type CruzamientoFn = (padre1: Array<number>, padre2: Array<number>) => Array<number>;

export const cruzamientoOrderCrossover: CruzamientoFn = (padre1: Array<number>, padre2: Array<number>) => {

    const n = padre1.length;
    let inicio = Math.floor(Math.random() * n);
    let fin = Math.floor(Math.random() * n);

    (inicio > fin) && ([inicio, fin] = [fin, inicio]);

    const hijo = Array(n).fill(-1);

    for (let i = inicio; i <= fin; i++)
        hijo[i] = padre1[i];

    let i = (fin + 1) % n;
    let j = (fin + 1) % n;

    while (i !== inicio) {

        if (hijo.includes(padre2[j])) {
            j = (j + 1) % n;
            continue;
        }

        hijo[i] = padre2[j];
        i = (i + 1) % n;
        j = (j + 1) % n;
    }

    return hijo;
}


export const cruzamientoPositionBasedCrossover: CruzamientoFn = (padre1: Array<number>, padre2: Array<number>) => {
    
    const n = padre1.length;
    let inicio = Math.floor(Math.random() * n);
    let fin = Math.floor(Math.random() * n);

    (inicio > fin) && ([inicio, fin] = [fin, inicio]);

    const hijo = Array(n).fill(-1);

    for (let i = inicio; i <= fin; i++)
        hijo[i] = padre1[i];

    let j = 0;
    for (let i = 0; i < n; i++) {
        if (hijo.includes(padre2[i]))
            continue;

        while (hijo[j] !== -1)
            j = (j + 1) % n;

        hijo[j] = padre2[i];
    }

    return hijo;
}