const redireccionar = (msg) => {
    alert(msg);
    location.replace("index.html");
}

function getIdFromQueryString() {
    const querystring = window.location.search
    console.log(querystring)
    const params = new URLSearchParams(querystring)
    if (params.has("id")) {
        return params.get('id')
    }
    return 0;
}



document.addEventListener("DOMContentLoaded", () => {

    idEscuela = getIdFromQueryString();

    if (!idEscuela) {
        redireccionar("No se especificó ninguna escuela.");
    }
    if (idEscuela === '1') {

        let titulo = document.getElementById("titulo");
        titulo.innerHTML = "Incripci&oacute;n Escuela De Ni&ntilde;os";

        var edad = document.getElementById("inputEdad");

        edad.min = 3;
        edad.max = 11;

    } else if (idEscuela === '2') {

        let titulo = document.getElementById("titulo");
        titulo.innerHTML = "Incripci&oacute;n Escuela De Jovenes";

        var edad = document.getElementById("inputEdad");

        edad.min = 14;
        edad.max = 20;

    } else if (idEscuela === '3') {

        let titulo = document.getElementById("titulo");
        titulo.innerHTML = "Incripci&oacute;n Escuela De Adultos";

        var edad = document.getElementById("inputEdad");

        edad.min = 21;
        edad.max = 100;

    } else {
        redireccionar("Escuela no valida.");
    }

    const inputs = document.querySelectorAll("input");
    inputs.forEach(
        function (myinput) {
            myinput.addEventListener("blur", validarInputs);
        }
    );

    //Botones
    document.querySelector("#btn_submit_form_evento").addEventListener("click", generarPreinscripcion);
    document.querySelector("#btn_imprimir_preinscripcion").addEventListener("click", imprimirPreinscripcion);
    document.querySelector("#btn_descargar_preinscripcion").addEventListener("click", descargarPreinscripcion);
    document.querySelector("#btn_descargar_cerrar").addEventListener("click", cerrarModal);
});

function cerrarModal() {
    var formulario = document.querySelector("#formulario");
    formulario.submit();
 
    setTimeout(function () {
        formulario.reset();
    }, 2000);

}

//Preinscripciones
function generarPreinscripcion(event) {

    var formulario = document.querySelector("#formulario")

    if (formulario.checkValidity()) {

        document.querySelector("#pi_titulo").textContent = document.querySelector("#titulo").innerHTML;
        document.querySelector("#pi_inputName").textContent = "Integrante: " + document.querySelector("#inputName").value
            + " " + document.querySelector("#inputApellido").value;

        document.querySelector("#pi_inputDni").textContent = "DNI: " + document.querySelector("#inputDni").value;

        document.querySelector("#pi_inputNombreContacto").textContent = "Persona: " + document.querySelector("#inputNombreContacto").value
            + " " + document.querySelector("#inputApellidoContacto").value;

        document.querySelector("#pi_inputTelefonoContacto").textContent = "Teléfono: " + document.querySelector("#inputTelefonoContacto").value;



        const myModal2 = new bootstrap.Modal('#preinscripcion_modal', {
            keyboard: false
        })

        myModal2.show();


    } else {

        formulario.reportValidity();
    }
}

function imprimirPreinscripcion() {

    var contenidoDiv = document.getElementById("pre_inscripcion_imprimible").innerHTML;
    var ventanaImpresion = window.open('', '_blank', 'width=500,height=500');

    ventanaImpresion.document.write('<html><head><title>Imprimir Preinscripción</title></head><body>'
        + contenidoDiv + '</body></html>');

    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

function descargarPreinscripcion() {

    var doc = new jsPDF();
    var elementHTML = document.querySelector("#pre_inscripcion_imprimible");
    doc.fromHTML(elementHTML, 15, 15, { 'width': 170 });
    doc.save('Constancia-Preinscripcion.pdf');
}


function validarInputs(event) {

    if (event.target.checkValidity()) {

        event.target.style.borderColor = "#ced4da";
    } else {

        event.target.style.borderColor = "crimson";
    }

}