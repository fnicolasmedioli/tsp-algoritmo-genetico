const config = {
    "tamano_poblacion": 100,
    "hijos_generados_por_iteracion": 30,
    "tamano_recambio_generacional": 10,
    "probabilidad_mutacion": 0.05
};

let ejecutando = false;

document.querySelector("#boton-actualizar-config").addEventListener("click", () => {

    config.tamano_poblacion = document.querySelector("#tamano_poblacion").value;
    config.hijos_generados_por_iteracion = document.querySelector("#hijos_generados_por_iteracion").value;
    config.tamano_recambio_generacional = document.querySelector("#tamano_recambio_generacional").value;
    config.probabilidad_mutacion = document.querySelector("#probabilidad_mutacion").value;

    alert("Configuración actualizada");
});

document.querySelector("#boton-iniciar-parar").addEventListener("click", () => {

    if (ejecutando)
    {
        document.querySelector("#boton-iniciar-parar").innerHTML = "Iniciar";
        ejecutando = false;

        fetch("/parar", {
            method: "POST"
        })
        .then(data => data.json())
        .catch(error => {
            alert(error);
        })
        .then(responseJson => {
            console.log(responseJson);
            cargarGrafico(responseJson.ruta_grafico);
        });
    }
    else
    {
        document.querySelector("#boton-iniciar-parar").innerHTML = "Parar";
        ejecutando = true;

        const nombre_archivo = document.querySelector("#select_nombre_archivo").value;

        const post_data = {
            config,
            nombre_archivo
        };

        fetch("/iniciar", {
            method: "POST",
            body: JSON.stringify(post_data)
        })
        .finally(() => {
            alert("Se inicio la ejecucion");
        });
    }
});


function cargarGrafico(rutaGrafico)
{
    const contenedorGrafico = document.getElementById("contenedor-grafico");
    contenedorGrafico.innerHTML = "";

    const elementoGrafico = document.createElement("img");
    elementoGrafico.src = rutaGrafico + "?" + evitar_cache();

    contenedorGrafico.appendChild(elementoGrafico);
}

function evitar_cache() {
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