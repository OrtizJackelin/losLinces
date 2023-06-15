
const fetchData = async () => {
   
    fetch('https://ortizjackelin.github.io/data.json')
    .then ((datos)=>datos.json())
    .then ((datos)=> {
        try {
           
            idEvento = getIdFromQueryString();
            if (!idEvento) {
                redireccionar("No se especificó un evento.");
            } else {
                var evento = buscarEventoPorId(datos,idEvento);
                if (evento==null) {
                    redireccionar("No se encontró el evento");
                }else if (!evento.inscripcion_habilitada) {
                    redireccionar("Evento no disponible para inscripciones");
                }
                completarFormulario(evento)
                
            }    
            
        } catch (error) {
            console.log(error);
            redireccionar("No se pudo abrir el formulario.");
        } 

    });
};

const redireccionar = (msg) => {
    alert(msg);
    location.replace("eventos.html");
}


//buscar la existencia del id y devolverlo
function getIdFromQueryString(){        
    const querystring = window.location.search
    console.log(querystring)
    const params = new URLSearchParams(querystring)
    if (params.has("id")){
        return params.get('id')
    }
    return 0;
}

function buscarEventoPorId(colleccion, id) {
    elemento = colleccion.find(elem => elem.id == id)
    return elemento;
}

//Se Ejecuta Despues de Descargar el DOM (HTML)
 document.addEventListener("DOMContentLoaded", () => {
    fetchData();
   
    document.querySelector("#inputdistancia").addEventListener("change", opcionCambiada);
    document.querySelector("#inputAge").addEventListener("blur",llenarComboCategoria);
    const inputs = document.querySelectorAll("input");
    inputs.forEach(
        function(myinput){
            myinput.addEventListener("blur",validarInputs);
        }
    );

    //Botones
    document.querySelector("#btn_submit_form_evento").addEventListener("click",generarPreinscripcion);
    document.querySelector("#btn_imprimir_preinscripcion").addEventListener("click",imprimirPreinscripcion);
    document.querySelector("#btn_descargar_preinscripcion").addEventListener("click",descargarPreinscripcion);
    document.querySelector("#btn_descargar_cerrar").addEventListener("click",cerrarModal);
});

function cerrarModal(){
   var formulario= document.querySelector("#formulario");
   formulario.submit();
}
function completarFormulario(evento){
    if(evento!=null){
        var distancia;
        document.querySelector("#h_nombre_evento").innerHTML =  evento.name;
        evento.distancias.forEach(element => {
                const option = document.createElement('option')
                option.value =element.costo;
                option.text =element.distancia;
                document.querySelector("#inputdistancia").appendChild(option);
        });
    }
}

const opcionCambiada = () => {                    
    const indice = document.querySelector("#inputdistancia").selectedIndex;
    if(indice === -1) return; // Esto es cuando no hay elementos
    const opcionSeleccionada = document.querySelector("#inputdistancia").options[indice];
        
    document.querySelector("#inputPrecio").value=opcionSeleccionada.value;
};


//Preinscripciones
function generarPreinscripcion(event){

    var formulario= document.querySelector("#formulario")
    if (formulario.checkValidity()){

        // generamos un numero aleatorio
        var numeroAleatorio = Math.floor(Math.random() * 100) + 1;

        //carga de datos en los p de la ventana modal
        document.querySelector("#pi_inputName").textContent = "Participante: " + document.querySelector("#inputName").value 
        + " " + document.querySelector("#inputLastName").value;

        document.querySelector("#pi_inputDni").textContent = "DNI: " + document.querySelector("#inputDni").value;

        document.querySelector("#pi_monto").innerHTML = "Realizar una transferencia por<b> " + document.querySelector("#inputPrecio").
        value +  "</b> pesos, a la caja de ahorros CBU 203876523e472384234 a nombre de 'Agrupación Los Linces'.";

        document.querySelector("#pi_numero").textContent = "Pre-inscripción número: " + numeroAleatorio;

        document.querySelector("#pi_numero2").textContent = numeroAleatorio;

        const myModal2 = new bootstrap.Modal('#preinscripcion_modal', {
            keyboard: false
        })

        myModal2.show();     

    }else{
        formulario.reportValidity();
    }
}

function imprimirPreinscripcion() {
    var contenidoDiv = document.getElementById("pre_inscripcion_imprimible").innerHTML;
    var ventanaImpresion = window.open('', '_blank', 'width=500,height=500');
    ventanaImpresion.document.write('<html><head><title>Imprimir Preinscripción</title></head><body>' + contenidoDiv + '</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}
function descargarPreinscripcion(){
    var doc = new jsPDF();
    var elementHTML = document.querySelector("#pre_inscripcion_imprimible");
    doc.fromHTML(elementHTML, 15, 15, {'width': 170});
    doc.save('Constancia-Preinscripcion.pdf');
}


function llenarComboCategoria(){
    var inputEdad=document.getElementById("inputAge").value;
    var inputCategoria=document.getElementById("inputCategoria");
    if(inputEdad!=null){
        
        switch (true) {

        case (inputEdad >= 16 && inputEdad <= 17):
            inputCategoria.value="Juvenil (16-17 años)";
            break;

        case (inputEdad >= 18 && inputEdad <= 19):
            inputCategoria.value="Junior (18-19 años)";
            break;

        case (inputEdad >= 20 && inputEdad <= 22):
            inputCategoria.value="Promesa (20-22 años)";
            console.log(inputCategoria.value);
            break;

        case (inputEdad >= 23 && inputEdad <= 34):
            inputCategoria.value="Senior (23-34 años)";
            break;

        case (inputEdad >= 35 && inputEdad <= 39):
            inputCategoria.value="Master 35 (35-39 años)";
            break;

        case (inputEdad >= 40 && inputEdad <= 44):
            inputCategoria.value="Master 40 (40-44 años)";
            break;

        case (inputEdad >= 45 && inputEdad <= 49):
            inputCategoria.value=">Master 45 (45-49 años)";
            break;
            
        case (inputEdad >= 50 && inputEdad <= 55):
            inputCategoria.value="Master 50 (50-55 años)";

            break;

        case (inputEdad >= 55 && inputEdad <= 59):
            inputCategoria.value="Master 55 (55-59 años)";
            break;
            
        case (inputEdad >=60  && inputEdad <= 90):
            inputCategoria.value="Master libre (60-90 años)";
            break;

        default:
            alert("La edad ingresada no es valida");
            inputCategoria.value=" ";
            break;
        }
    }
}

//el input del evento
function validarInputs(event){

    var resultado=event.target.checkValidity();

    if(event.target.id==='inputEmail4'){
        resultado= validarEmail(event.target.value);
    }
    if(resultado){
      
        event.target.style.borderColor="#ced4da";
    }else{
      
        event.target.style.borderColor="crimson";
    }

    
}

function validarEmail(email){

    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,3})$/;
    return regex.test(email) ? true : false;
    
}




