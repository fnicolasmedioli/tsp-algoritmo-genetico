export const defaultConfig: ProgramConfig = {
    tamano_poblacion: 200,
    hijos_generados_por_iteracion: 50,
    tamano_recambio_generacional: 15,
    probabilidad_mutacion: 0.01,
    select_padres: "ruleta",
    select_cruzamiento: "order_crossover",
    select_mutacion: "inversion"
};

export function ConfigManager({config, setConfig, isRunning}: {config: ProgramConfig, setConfig: Function, isRunning: boolean}) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { id, value } = event.target;

        setConfig({
            ...config,
            [id]: value
        });
    };

    return (

        <div className="config-form">

            <label htmlFor="tamano_poblacion">Tamaño de la población (fija)</label>
            <input type="number" id="tamano_poblacion" value={config["tamano_poblacion"]} onChange={handleChange} disabled={isRunning} />

            <label htmlFor="hijos_generados_por_iteracion">Hijos generados por iteración</label>
            <input type="number" id="hijos_generados_por_iteracion" value={config["hijos_generados_por_iteracion"]} onChange={handleChange} />

            <label htmlFor="tamano_recambio_generacional">Tamaño del recambio generacional</label>
            <input type="number" id="tamano_recambio_generacional" value={config["tamano_recambio_generacional"]} onChange={handleChange} />

            <label htmlFor="probabilidad_mutacion">Probabilidad de mutación</label>
            <input type="number" id="probabilidad_mutacion" value={config["probabilidad_mutacion"]} onChange={handleChange} />

            <label htmlFor="select_padres"><span>Método de selección de padres</span></label>
            <select id="select_padres" onChange={handleChange}>
                <option value="ruleta">Ruleta</option>
                <option value="torneo">Torneo</option>
            </select>

            <label htmlFor="select_cruzamiento"><span>Método de cruzamiento</span></label>
            <select id="select_cruzamiento" onChange={handleChange}>
                <option value="order_crossover">Order Crossover</option>
                <option value="position_based_crossover">Position-Based Crossover</option>
            </select>

            <label htmlFor="select_mutacion"><span>Operador de mutación</span></label>
            <select id="select_mutacion" onChange={handleChange}>
                <option value="inversion">Inversión</option>
                <option value="intercambio">Intercambio</option>
            </select>

        </div>
    );
}