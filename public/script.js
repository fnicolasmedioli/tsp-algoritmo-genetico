const botonIniciarParar = document.querySelector("#boton-iniciar-parar");
const datosFinalizacion = document.querySelector("#datos-finalizacion");

let ejecutando = false;

function leerConfig()
{
    const config = {};
    config.tamano_poblacion = Number(document.querySelector("#tamano_poblacion").value);
    config.hijos_generados_por_iteracion = Number(document.querySelector("#hijos_generados_por_iteracion").value);
    config.tamano_recambio_generacional = Number(document.querySelector("#tamano_recambio_generacional").value);
    config.probabilidad_mutacion = Number(document.querySelector("#probabilidad_mutacion").value);
    config.nombre_archivo = document.querySelector("#select_nombre_archivo").value;
    config.metodo_seleccion_padres = document.querySelector("#select_padres").value;
    config.metodo_cruzamiento = document.querySelector("#select_cruzamiento").value;
    config.metodo_mutacion = document.querySelector("#select_mutacion").value;

    return config;
}

document.querySelector("#boton-iniciar-parar").addEventListener("click", () => {

    if (ejecutando)
    {
        botonIniciarParar.innerHTML = "Iniciar";
        ejecutando = false;

        fetch("/parar", {
            method: "POST"
        })
        .then(data => data.json())
        .then(responseJson => {
            console.log(responseJson);
            if (responseJson.ruta_grafico)
                cargarGrafico(responseJson.ruta_grafico);

            if (responseJson["config"])
            {
                datosFinalizacion.innerHTML = "Configuracion utilizada:\n";
                datosFinalizacion.innerHTML += JSON.stringify(responseJson["config"], null, 4) + "\n\n";
            }
            if (responseJson["segundos_ejecucion"])
            {
                datosFinalizacion.innerHTML += "Tiempo de procesamiento: " + responseJson["segundos_ejecucion"] + " segundos\n";
            }
        })
        .catch(console.log);
    }
    else
    {
        botonIniciarParar.innerHTML = "Parar";
        ejecutando = true;

        fetch("/iniciar", {
            method: "POST",
            body: JSON.stringify(leerConfig())
        });
    }
});


function cargarGrafico(rutaGrafico)
{
    const contenedorGrafico = document.getElementById("contenedor-grafico");
    contenedorGrafico.innerHTML = "";

    const elementoGrafico = document.createElement("img");
    elementoGrafico.src = rutaGrafico + "?" + evitaCache();

    contenedorGrafico.appendChild(elementoGrafico);
}


function evitaCache() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 15) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

(async () => {

    while (true)
    {
        let data = null;

        try {
            data = await new Promise((resolve, reject) => {
                fetch("/estado", {
                    method: "POST"
                })
                .then(data => data.json())
                .then(resolve)
                .catch(reject);
            });
        }
        catch (error) {
            console.log(error);
        }

        mostrarDatos(data);

        if (data && data["ejecutando"] == false && ejecutando)
        {
            ejecutando = false;
            botonIniciarParar.innerHTML = "Iniciar";

            if (data["ruta_grafico"])
                cargarGrafico(data["ruta_grafico"]);
        }

        if (data && data["ejecutando"] == true && !ejecutando)
        {
            ejecutando = true;
            botonIniciarParar.innerHTML = "Parar";
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

})();


const elementoPoblacion = document.querySelector("#poblacion");
const elementoDatos = document.querySelector("#datos");

function cromosomaToString(cromosoma)
{
    let str = "";
    str += `Fitness: ${cromosoma.fitness} Costo: ${cromosoma.costo} Cadena: ${cromosoma.genes[0]}`;
    for (let i = 1; i < cromosoma.genes.length; i++)
        str += `, ${cromosoma.genes[i]}`;
    return str;
}

function mostrarDatos(datos)
{
    if (datos == null)
        return;

    if (datos["poblacion"])
    {
        elementoPoblacion.innerHTML = "";

        let str = "";

        const poblacion = datos["poblacion"];

        for (cromosoma of poblacion)
            str += cromosomaToString(cromosoma) + "\n";

        elementoPoblacion.innerHTML = str;
    }

    if (datos["generacion_actual"])
    {
        elementoDatos.innerHTML = "";
        elementoDatos.innerHTML += `Generación actual: ${datos["generacion_actual"]}\n\n`;
    }

    if (datos["mejor_cromosoma"])
    {        
        elementoDatos.innerHTML += "Mejor cromosoma:\n\n" + cromosomaToString(datos["mejor_cromosoma"]) + "\n\n";
    }
        
    if (datos["historial_mejores"])
    {
        elementoDatos.innerHTML += "Historial de mejoras:\n\n";
        for ({ cromosoma, generacion, segundos } of datos["historial_mejores"])
            elementoDatos.innerHTML += `Generación ${generacion} encuentra una mejora, nuevo costo: ${cromosoma.costo} | ` + cromosomaToString(cromosoma) + ` luego de ${segundos} segundos\n`;
    }    
    
}