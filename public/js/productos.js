// ===============================
//  Captura de elementos del DOM
// ===============================

// Formulario de productos
const formProductos = document.getElementById("productoForm");

// Cuerpo de la tabla donde se agregarán los productos
const tablaProductos = document.querySelector("#tablaProductos tbody");


// =======================================
//  Evento para agregar productos a la tabla
// =======================================

formProductos.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página
    
    // Obtener valores del formulario
    const producto = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioProducto").value;
    
    // Crear una nueva fila con los datos ingresados
    const fila = `
        <tr>
            <td>${producto}</td>
            <td>$${precio}</td>
        </tr>
    `;
    
    // Insertar la fila en la tabla
    tablaProductos.innerHTML += fila;
    
    // Reiniciar el formulario para limpiar los campos
    formProductos.reset();
});

