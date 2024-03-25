import './App.css'

import { useState } from 'react';

import ATSPMatrix from './ATSPMatrix';
import { ConfigManager, defaultConfig } from './ConfigManager';
import { ProgramConfig } from './types';

// import * as Plotly from 'plotly.js-dist-min';

function App() {

  const [config, setConfig] = useState<ProgramConfig>(defaultConfig);
  const [matrix, setMatrix] = useState<ATSPMatrix | null>(null);
  const [isRunning, setRunning] = useState<boolean>(false);

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

      <ConfigManager config={config!} setConfig={setConfig} isRunning={isRunning} />

      {
        matrix &&
        <button id="boton-iniciar-parar" onClick={() => setRunning(a => !a)}>
          { isRunning ? "Parar" : "Iniciar" }
        </button>
      }

    </>
  )
}

export default App;