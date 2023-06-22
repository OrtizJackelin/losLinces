
var listaEventos;

document.addEventListener("DOMContentLoaded", () => {

    fetchData();

    document.querySelector("#inputFiltroDistancia").addEventListener("change", aplicarFiltros);
    document.querySelector("#inputFiltroCiudad").addEventListener("change", aplicarFiltros);
    document.querySelector("#botonFiltro").addEventListener("click", function () {

        const estadoBoton = document.querySelector("#botonFiltro");

        if (estadoBoton.innerText === 'Mostar Filtros') {

            estadoBoton.innerText = "Ocultar Filtros"
        }
        else {

            estadoBoton.innerText = "Mostar Filtros"
        }

    });
});



const fetchData = async () => {

    fetch('https://ortizjackelin.github.io/data.json')
        .then((res) => res.json())
        .then((res) => {
            try {
                mostrarSpinner(false);
                listaEventos = res;
                pintarDatos(res);
            } catch (error) {
                console.log(error);
            }
            finally {
                mostrarSpinner(false);
            }
        });
};

const mostrarSpinner = (estado) => {
    const loading = document.querySelector("#loading");
    if (estado) {
        loading.classList.remove("d-none");
    } else {
        loading.classList.add("d-none");
    }
};

const pintarDatos = (data) => {
    const cards = document.querySelector("#card-dinamica");
    const templateCard = document.querySelector("#template-card").content;
    const fragment = document.createDocumentFragment();

    //Para llenar el select del filtro de ciudades distancias
    var listaCiudades = {};
    var listaDistancias = {};

    cards.textContent = "";

    data.forEach((evento) => {
        var distancia = "";
        const clone = templateCard.cloneNode(true);
        clone.querySelector("#p_nombre_evento").textContent = "Carrera: " + evento.name.substring(0, 35);
        clone.querySelector("#p_ciudad_evento").textContent = "Ciudad: " + evento.city;
        clone.querySelector("#p_fecha_evento").textContent = "Fecha: " + evento.date + " " + " " + "Hora: " + evento.hour;
        clone.querySelector("#p_largada_evento").textContent = "Largada: " + evento.ubicacion.substring(0, 40);

        evento.distancias.forEach((item) => {

            distancia = distancia + item.distancia + "K ";
        });

        clone.querySelector("#p_distancia_evento").textContent = "distancia: " + distancia;

        clone.querySelector("#img_evento").setAttribute("src", evento.url);


        //Deshabilitar o habilitar link de inscripcion///
        if (evento.inscripcion_habilitada) {
            clone.querySelector("#a_inscribirme").setAttribute("href", "formularioEvento.html?id=" + evento.id);

        } else {

            clone.querySelector("#a_inscribirme").setAttribute("aria-disabled", "true");
            clone.querySelector("#a_inscribirme").classList.add("disabled");
            if (evento.evento_finalizado) {
                clone.querySelector("#mensaje_estado_carrera").textContent = "Evento Finalizado";
            }
            else {
                clone.querySelector("#mensaje_estado_carrera").textContent = "¡Proximamente!";
            }

        }
        //Agregar card
        fragment.appendChild(clone);

        //Crear lista de ciudades para usar luego en el filtro
        listaCiudades[evento.city] = evento.city;

        //Crear lista de distancias para usar luego en el filtro
        evento.distancias.forEach((item) => {
            listaDistancias[item.distancia] = item.distancia;
        });
    });

    // agregar  todas la card a la pagina
    cards.appendChild(fragment);

    //llenar el select de ciudades para el filtro
    if (document.querySelector("#inputFiltroCiudad").options.length == 1) {
        for (var clave in listaCiudades) {
            const option = document.createElement('option')
            option.value = clave;
            option.text = clave;
            document.querySelector("#inputFiltroCiudad").appendChild(option);
        }
    }

    //llenar el select de distancias para el filtro
    if (document.querySelector("#inputFiltroDistancia").options.length == 1) {
        for (var clave in listaDistancias) {
            const option = document.createElement('option')
            option.value = clave;
            option.text = clave;
            document.querySelector("#inputFiltroDistancia").appendChild(option);
        }
    }
}


const aplicarFiltros = () => {
    const ciudadSeleccionada = document.querySelector("#inputFiltroCiudad").value;
    const distanciaSeleccionada = document.querySelector("#inputFiltroDistancia").value;
    var eventosFiltrados;
    if (ciudadSeleccionada == 1) {
        eventosFiltrados = listaEventos;
    } else {
        var eventosPorCiudad = listaEventos.filter(function (evento) {
            return evento.city === ciudadSeleccionada;
        });
        eventosFiltrados = eventosPorCiudad;
    }
    if (distanciaSeleccionada != 1) {
        var eventosPorDistancia = eventosFiltrados.filter(function (evento) {
            var iguales = false;
            evento.distancias.forEach((item) => {
                if (item.distancia == distanciaSeleccionada) iguales = true;
            });
            return iguales;
        });
        eventosFiltrados = eventosPorDistancia;
    }
    pintarDatos(eventosFiltrados);
};

