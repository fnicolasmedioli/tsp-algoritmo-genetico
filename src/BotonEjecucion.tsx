export const BotonEjecucion = ({ running, enabled, runAlgorithm, stopAlgorithm }: {  running: boolean, enabled: boolean, runAlgorithm: Function, stopAlgorithm: Function }) => {

    function handleClick() {
        if (!enabled)
            return;
        if (running) {
            stopAlgorithm();
        } else {
            runAlgorithm();
        }
    }

    return (
        <button id="boton-iniciar-parar" onClick={handleClick} disabled={!enabled} title="fasddfas" className={!enabled ? "disabled-button": ""}  >
            { running ? "Parar" : "Iniciar" }
        </button>
    );
};