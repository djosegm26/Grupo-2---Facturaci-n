// ===============================
//  Captura de elementos del DOM
// ===============================

// Formulario de servicios
const formServicios = document.getElementById("servicioForm");

// Cuerpo de la tabla donde se agregarán los servicios
const tablaServicios = document.querySelector("#tablaServicios tbody");


// =======================================
//  Evento para agregar servicios a la tabla
// =======================================

formServicios.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página
    
    // Obtener valores del formulario
    const servicio = document.getElementById("nombreServicio").value;
    const precio = document.getElementById("precioServicio").value;
    
    // Crear una nueva fila con los datos ingresados
    const fila = `
        <tr>
            <td>${servicio}</td>
            <td>$${precio}</td>
        </tr>
    `;
    
    // Insertar la fila en la tabla
    tablaServicios.innerHTML += fila;
    
    // Reiniciar el formulario para limpiar los campos
    formServicios.reset();
});
