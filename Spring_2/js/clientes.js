const formClientes = document.getElementById("clienteForm");
const tablaClientes = document.querySelector("#tablaClientes tbody");

formClientes.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById("nombreCliente").value;
    const email = document.getElementById("emailCliente").value;
    const tel = document.getElementById("telefonoCliente").value;
    
    const fila = `<tr><td>${nombre}</td><td>${email}</td><td>${tel}</td></tr>`;
    tablaClientes.innerHTML += fila;
    
    formClientes.reset();
});

