import './App.css'

import ATSPMatrix from './ATSPMatrix';

function App() {

  return (
    <>
      <h2>Algoritmo genético para problema del viajante</h2>
      <input type="file" id="file-selector" accept=".atsp" onChange={() => {

        const fileSelector = document.getElementById('file-selector') as HTMLInputElement

        if (fileSelector.files) {
          const file = fileSelector.files[0]
          const reader = new FileReader()
          
          reader.onload = () => {
            const text: string = reader.result as string;
            const matrix = new ATSPMatrix(text);
            
          }
          reader.readAsText(file)
        }
      }}/>
    </>
  )
}

export default App
