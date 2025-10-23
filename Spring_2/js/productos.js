const formProductos = document.getElementById("productoForm");
const tablaProductos = document.querySelector("#tablaProductos tbody");

formProductos.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const producto = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioProducto").value;
    
    const fila = `<tr><td>${producto}</td><td>$${precio}</td></tr>`;
    tablaProductos.innerHTML += fila;
    
    formProductos.reset();
});
