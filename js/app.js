//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos
evenListeners();
function evenListeners() {
    document.addEventListener('DOMContentLoaded', pregutarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        // console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        // array.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)
        this.restante = this.presupuesto - gastado;
        // console.log(this.restante);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        /* El método filter() crea un nuevo array con todos los elementos que cumplan la condición 
        implementada por la función dada. sintaxis arr.filter(element => element.length > 6) */
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // console.log(cantidad);
        //Extrayendo valores
        const { presupuesto, restante } = cantidad;

        //Agregar al HTML
        const total = document.querySelector('#total');
        total.textContent = presupuesto;
        const restante2 = document.querySelector('#restante');
        restante2.textContent = restante;

    }

    imprimirAlerta(mensaje, tipo) {
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostarGastos(gastos) {

        this.limpiarHTML(); //Elimina el HTML previo

        //Iterar sobre los gastos
        gastos.forEach(gasto => {

            const { nombre, cantidad, id } = gasto;

            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id; //esta linea hace lo mismo que la linea de arriba

            //Agregar al HTML del gastos
            nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> $ ${cantidad}</span>`;

            //Boton para agregar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        const restante2 = document.querySelector('#restante');
        restante2.textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //Comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }
        //Comprobar 50% 
        else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupueseto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instanciar
const ui = new UI();

let presupuesto;

//Funciones
function pregutarPresupuesto() {
    const presupuestoUsuario = Number(prompt('¿Cuál es tu presupuesto'));
    // console.log(presupuestoUsuario);
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    // console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

// Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    // console.log(nombre);
    const cantidad = Number(document.querySelector('#cantidad').value);
    // console.log(cantidad);

    //Validar 
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
    } else {
        // console.log('Agregando Gasto');
        //Generar un objeto con el gasto
        const gasto = { nombre, cantidad, id: Date.now() }

        //añade un nuevo gasto
        presupuesto.nuevoGasto(gasto);

        //Muestra mensaje de éxito
        ui.imprimirAlerta('Gasto agregado correctamente');

        //Imprimir los gastos
        const { gastos, restante } = presupuesto;
        ui.mostarGastos(gastos);

        ui.actualizarRestante(restante);

        ui.comprobarPresupuesto(presupuesto);

        //Reinicia el formulario
        formulario.reset();

    }
}

function eliminarGasto(id) {
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

}
