import { useState } from 'react';

import ATSPMatrix from './ATSPMatrix';
import { ConfigManager, defaultConfig } from './ConfigManager';
import { Mejora, ProgramConfig } from './types';

import SolucionATSP from './algoritmo-genetico/SolucionATSP';
import { BotonEjecucion } from './BotonEjecucion';

function App() {

  const [config, setConfig] = useState<ProgramConfig>(defaultConfig);
  const [matrix, setMatrix] = useState<ATSPMatrix | null>(null);
  const [isRunning, setRunning] = useState<boolean>(false);
  const [solucionATSP, setSolucionATSP] = useState<SolucionATSP>();
  const [mejoras, setMejoras] = useState<Array<Mejora>>([]);

  function runAlgorithm() {

    setMejoras([]);
    const solucion = new SolucionATSP(config, matrix!);
    solucion.run(setMejoras);

    setSolucionATSP(solucion);
    setRunning(true);
  }

  function stopAlgorithm() {
    solucionATSP?.stop();
    setRunning(false);
  }

  function getCadenaMejoras() {

    let cadena = "";
    for (const mejora of mejoras) {
      cadena += `Iteración ${mejora.iteracion}, costo ${mejora.cromosoma.getCosto()}, tiempo (ms) ${mejora.deltaTime} ->\n  ${mejora.cromosoma.getGenes().toString() + "," + mejora.cromosoma.getGenes()[0]}\n\n`;
    }
    return cadena;
  }

  return (
    <>
      <h2>Algoritmo genético para problema del viajante</h2>

      <input type="file" id="file-selector" accept=".atsp" onChange={() => {

        setMatrix(null);
        setRunning(false);

        const fileSelector = document.getElementById('file-selector') as HTMLInputElement

        if (fileSelector.files && fileSelector.files.length > 0) {

          const file = fileSelector.files[0]
          const reader = new FileReader()

          reader.onload = () => {
            const text: string = reader.result as string;
            try {
              setMatrix(new ATSPMatrix(text));
            } catch {
              alert("El archivo seleccionado no es un archivo de ATSP válido.");
              fileSelector.value = "";
            }
          };

          reader.readAsText(file)
        }

      }} />

      <div style={{ width: "100%", display: "flex", flexWrap: "wrap", columnGap:"20px" }}>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <ConfigManager config={config!} setConfig={setConfig} isRunning={isRunning} />

          <div>
            <BotonEjecucion running={isRunning} enabled={matrix !== null && isValidConfig(config)} runAlgorithm={runAlgorithm} stopAlgorithm={stopAlgorithm} />
            <button onClick={() => descargarResultados(config, getCadenaMejoras())} disabled={mejoras.length === 0} style={{ marginLeft: "10px" }} className={mejoras.length === 0 ? "disabled-button": ""}><u>⭳</u></button>
          </div>
        </div>

        <div id="plotly-graph" style={{ flexGrow: 1 }}></div>

      </div>

      <textarea name="" id="" style={{
        width: "100%",
        border: "none",
        height: "200px",
        padding: 0,
        position: "relative",
        top: "10px"
      }} readOnly value={getCadenaMejoras()}>
      </textarea>

    </>
  )
}


function isValidConfig(config: ProgramConfig): boolean {

  if (config.tamano_poblacion < 2) return false;
  if (config.hijos_generados_por_iteracion < 1) return false;
  if (config.tamano_recambio_generacional < 1) return false;
  if (config.probabilidad_mutacion < 0 || config.probabilidad_mutacion > 1) return false;
  if (config.tamano_recambio_generacional > config.tamano_poblacion) return false;
  if (config.tamano_recambio_generacional > config.hijos_generados_por_iteracion) return false;

  return true;
}


function descargarResultados(config: ProgramConfig, resultados: string) {

  let texto = "Configuración utilizada:\n\n";

  texto += `Tamaño de la población: ${config.tamano_poblacion}\n`;
  texto += `Hijos generados por iteración: ${config.hijos_generados_por_iteracion}\n`;
  texto += `Tamaño del recambio generacional: ${config.tamano_recambio_generacional}\n`;
  texto += `Probabilidad de mutación: ${config.probabilidad_mutacion}\n`;
  texto += `Selección de padres: ${config.select_padres.descripcion}\n`;
  texto += `Cruzamiento: ${config.select_cruzamiento.descripcion}\n`;
  texto += `Mutación: ${config.select_mutacion.descripcion}\n\n`;

  texto += "Resultados:\n\n";

  texto += resultados;

  const blob = new Blob([texto], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = "resultados.txt";
  document.body.appendChild(enlace);
  enlace.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(enlace);
}

export default App;