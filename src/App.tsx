import { useState } from 'react';

import ATSPMatrix from './ATSPMatrix';
import { ConfigManager, defaultConfig } from './ConfigManager';
import { Mejora, ProgramConfig } from './types';

import SolucionATSP from './algoritmo-genetico/SolucionATSP';

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
      cadena += `Iteración ${mejora.iteracion}, costo ${mejora.cromosoma.getCosto()}, tiempo (ms) ${mejora.deltaTime} ->\n  ${mejora.cromosoma.getGenes().toString()}\n\n`;
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

          {
            matrix &&
            <button id="boton-iniciar-parar" onClick={() => ((isRunning) ? stopAlgorithm() : runAlgorithm())}>
              { isRunning ? "Parar" : "Iniciar" }
            </button>
          }
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

export default App;