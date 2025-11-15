// Obtiene la referencia al formulario de clientes
const formClientes = document.getElementById("clienteForm");

// Obtiene el cuerpo de la tabla donde se agregarán los registros
const tablaClientes = document.querySelector("#tablaClientes tbody");

// Evento que se ejecuta al enviar el formulario
formClientes.addEventListener("submit", function(e) {

    e.preventDefault(); 
    // Evita que el formulario recargue la página al enviarse

    // Obtiene los valores ingresados en los campos del formulario
    const nombre = document.getElementById("nombreCliente").value;
    const email = document.getElementById("emailCliente").value;
    const tel = document.getElementById("telefonoCliente").value;

    // Crea una nueva fila para insertar en la tabla
    const fila = `<tr>
                    <td>${nombre}</td>
                    <td>${email}</td>
                    <td>${tel}</td>
                  </tr>`;

    // Agrega la nueva fila al contenido actual de la tabla
    tablaClientes.innerHTML += fila;

    // Limpia el formulario después de agregar el registro
    formClientes.reset();
});


