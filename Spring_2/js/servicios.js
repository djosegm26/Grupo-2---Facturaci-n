const formServicios = document.getElementById("servicioForm");
const tablaServicios = document.querySelector("#tablaServicios tbody");

formServicios.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const servicio = document.getElementById("nombreServicio").value;
    const precio = document.getElementById("precioServicio").value;
    
    const fila = `<tr><td>${servicio}</td><td>$${precio}</td></tr>`;
    tablaServicios.innerHTML += fila;
    
    formServicios.reset();
});
