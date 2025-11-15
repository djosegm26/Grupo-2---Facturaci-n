// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  
  console.log("JS facturas cargado correctamente");

  // Referencias a elementos del formulario
  const form = document.getElementById("facturaForm");
  const selectTipo = document.getElementById("tipoItem");
  const selectProducto = document.getElementById("productoSelect");
  const selectServicio = document.getElementById("servicioSelect");
  const cantidadInput = document.getElementById("cantidadItem");
  const precioInput = document.getElementById("precioItem");
  const descripcionInput = document.getElementById("descItem");
  const btnAgregar = document.getElementById("agregarItem");

  // Referencias a tabla y totales
  const tbody = document.querySelector("#itemsFactura tbody");
  const subtotalEl = document.getElementById("subtotal");
  const impuestosEl = document.getElementById("impuestos");
  const totalEl = document.getElementById("total");

  // Verifica que el botón Agregar exista
  if (!btnAgregar) {
    console.error("No se encontró el botón Agregar.");
    return;
  }

  /**
   * Muestra u oculta los selectores según el tipo (producto o servicio)
   */
  function actualizarSelects() {
    if (selectTipo.value === "producto") {
      selectProducto.style.display = "";
      selectServicio.style.display = "none";
    } else {
      selectProducto.style.display = "none";
      selectServicio.style.display = "";
    }
    actualizarPrecioAutomatico(); // Actualiza el precio al cambiar de tipo
  }

  // Detecta cambios en el tipo de ítem
  selectTipo.addEventListener("change", actualizarSelects);
  actualizarSelects(); // Inicializa la vista

  /**
   * Asigna el precio automáticamente según el producto o servicio seleccionado
   */
  function actualizarPrecioAutomatico() {
    if (selectTipo.value === "producto") {
      const selected = selectProducto.options[selectProducto.selectedIndex];
      precioInput.value = selected ? selected.dataset.precio || 0 : 0;
    } else {
      const selected = selectServicio.options[selectServicio.selectedIndex];
      precioInput.value = selected ? selected.dataset.precio || 0 : 0;
    }
  }

  // Actualiza precio cuando cambia el producto o servicio
  selectProducto.addEventListener("change", actualizarPrecioAutomatico);
  selectServicio.addEventListener("change", actualizarPrecioAutomatico);

  /**
   * Agrega un ítem a la tabla
   */
  btnAgregar.addEventListener("click", (e) => {
    e.preventDefault();

    const tipo = selectTipo.value;
    const producto_id = tipo === "producto" ? selectProducto.value : null;
    const servicio_id = tipo === "servicio" ? selectServicio.value : null;
    const descripcion = descripcionInput.value || "";
    const cantidad = parseInt(cantidadInput.value || "1");
    const precio_unitario = parseFloat(precioInput.value || 0);
    const subtotal = +(cantidad * precio_unitario).toFixed(2);

    // Validaciones básicas
    if (tipo === "producto" && !producto_id) {
      alert("Selecciona un producto");
      return;
    }
    if (tipo === "servicio" && !servicio_id) {
      alert("Selecciona un servicio");
      return;
    }

    // Crea una nueva fila en la tabla
    const tr = document.createElement("tr");
    tr.dataset.subtotal = subtotal;
    tr.dataset.productoId = producto_id || "";
    tr.dataset.servicioId = servicio_id || "";
    tr.dataset.cantidad = cantidad;
    tr.dataset.precioUnitario = precio_unitario;
    tr.dataset.descripcion = descripcion;

    // Contenido HTML de la fila
    tr.innerHTML = `
      <td>${tipo}</td>
      <td>${descripcion || "-"}</td>
      <td>${cantidad}</td>
      <td>${precio_unitario.toFixed(2)}</td>
      <td>${subtotal.toFixed(2)}</td>
      <td><button type="button" class="btnEliminar">🗑</button></td>
    `;

    // Agrega la fila al cuerpo de la tabla
    tbody.appendChild(tr);

    // Recalcula los totales
    actualizarTotales();
  });

  /**
   * Elimina una fila cuando se presiona el botón correspondiente
   */
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnEliminar")) {
      e.target.closest("tr").remove();
      actualizarTotales();
    }
  });

  /**
   * Recalcula subtotal, impuestos y total
   */
  function actualizarTotales() {
    let sub = 0;

    // Suma los subtotales almacenados en los dataset de cada fila
    tbody.querySelectorAll("tr").forEach(tr => {
      sub += parseFloat(tr.dataset.subtotal);
    });

    subtotalEl.textContent = sub.toFixed(2);

    const impuestoPorc = parseFloat(impuestosEl.value || 0);
    const total = sub + (sub * impuestoPorc / 100);

    totalEl.textContent = total.toFixed(2);
  }

  // Recalcula totales al cambiar el porcentaje de impuestos
  impuestosEl.addEventListener("input", actualizarTotales);

  /**
   * Envía la información de la factura al backend
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura valores generales de la factura
    const numero_factura = document.getElementById("numeroFactura").value;
    const fecha_emision = document.getElementById("fechaEmision").value;
    const cliente_id = document.getElementById("clienteSelect").value;
    const usuario_id = document.getElementById("usuarioSelect").value;
    const impuestos = parseFloat(impuestosEl.value || 0);
    const subtotal = parseFloat(subtotalEl.textContent || 0);
    const total = parseFloat(totalEl.textContent || 0);

    // Construye el array de ítems desde la tabla
    const items = [];
    tbody.querySelectorAll("tr").forEach(tr => {
      items.push({
        producto_id: tr.dataset.productoId || null,
        servicio_id: tr.dataset.servicioId || null,
        descripcion: tr.dataset.descripcion || "",
        cantidad: parseInt(tr.dataset.cantidad),
        precio_unitario: parseFloat(tr.dataset.precioUnitario),
        subtotal: parseFloat(tr.dataset.subtotal)
      });
    });

    // Validación final
    if (!numero_factura || !fecha_emision || !cliente_id || !usuario_id || items.length === 0) {
      alert("Por favor completa todos los campos y agrega al menos un ítem.");
      return;
    }

    // Construcción del objeto payload a enviar
    const payload = {
      numero_factura,
      fecha_emision,
      cliente_id,
      usuario_id,
      impuestos,
      subtotal,
      total,
      items
    };

    try {
      // Envía la factura al backend
      const res = await fetch("/facturas/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      // Manejo de respuesta
      if (data.ok) {
        alert("Factura registrada correctamente");
        window.location.href = "/facturas";
      } else {
        alert("Error: " + (data.message || "No se pudo crear la factura"));
      }

    } catch (err) {
      console.error("Error enviando factura:", err);
      alert("Error al enviar la factura.");
    }
  });
});

