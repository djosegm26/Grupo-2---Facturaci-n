document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS facturas cargado correctamente");

  const form = document.getElementById("facturaForm");
  const selectTipo = document.getElementById("tipoItem");
  const selectProducto = document.getElementById("productoSelect");
  const selectServicio = document.getElementById("servicioSelect");
  const cantidadInput = document.getElementById("cantidadItem");
  const precioInput = document.getElementById("precioItem");
  const descripcionInput = document.getElementById("descItem");
  const btnAgregar = document.getElementById("agregarItem");
  const tbody = document.querySelector("#itemsFactura tbody");
  const subtotalEl = document.getElementById("subtotal");
  const impuestosEl = document.getElementById("impuestos");
  const totalEl = document.getElementById("total");

  if (!btnAgregar) {
    console.error("❌ No se encontró el botón Agregar.");
    return;
  }

  // 🔹 Mostrar u ocultar selects según el tipo
  function actualizarSelects() {
    if (selectTipo.value === "producto") {
      selectProducto.style.display = "";
      selectServicio.style.display = "none";
    } else {
      selectProducto.style.display = "none";
      selectServicio.style.display = "";
    }
    actualizarPrecioAutomatico();
  }
  selectTipo.addEventListener("change", actualizarSelects);
  actualizarSelects();

  // 🔹 Asignar precio automáticamente según selección
  function actualizarPrecioAutomatico() {
    if (selectTipo.value === "producto") {
      const selected = selectProducto.options[selectProducto.selectedIndex];
      precioInput.value = selected ? selected.dataset.precio || 0 : 0;
    } else {
      const selected = selectServicio.options[selectServicio.selectedIndex];
      precioInput.value = selected ? selected.dataset.precio || 0 : 0;
    }
  }
  selectProducto.addEventListener("change", actualizarPrecioAutomatico);
  selectServicio.addEventListener("change", actualizarPrecioAutomatico);

  // 🔹 Agregar item a la tabla
  btnAgregar.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🟢 Click en Agregar");

    const tipo = selectTipo.value;
    const producto_id = tipo === "producto" ? selectProducto.value : null;
    const servicio_id = tipo === "servicio" ? selectServicio.value : null;
    const descripcion = descripcionInput.value || "";
    const cantidad = parseInt(cantidadInput.value || "1");
    const precio_unitario = parseFloat(precioInput.value || 0);
    const subtotal = +(cantidad * precio_unitario).toFixed(2);

    if (tipo === "producto" && !producto_id) {
      alert("Selecciona un producto");
      return;
    }
    if (tipo === "servicio" && !servicio_id) {
      alert("Selecciona un servicio");
      return;
    }

    const tr = document.createElement("tr");
    tr.dataset.subtotal = subtotal;
    tr.dataset.productoId = producto_id || "";
    tr.dataset.servicioId = servicio_id || "";
    tr.dataset.cantidad = cantidad;
    tr.dataset.precioUnitario = precio_unitario;
    tr.dataset.descripcion = descripcion;

    tr.innerHTML = `
      <td>${tipo}</td>
      <td>${descripcion || "-"}</td>
      <td>${cantidad}</td>
      <td>${precio_unitario.toFixed(2)}</td>
      <td>${subtotal.toFixed(2)}</td>
      <td><button type="button" class="btnEliminar">🗑</button></td>
    `;
    tbody.appendChild(tr);
    actualizarTotales();
  });

  // 🔹 Eliminar fila
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnEliminar")) {
      e.target.closest("tr").remove();
      actualizarTotales();
    }
  });

  // 🔹 Calcular totales con impuesto en %
  function actualizarTotales() {
    let sub = 0;
    tbody.querySelectorAll("tr").forEach(tr => {
      sub += parseFloat(tr.dataset.subtotal);
    });
    subtotalEl.textContent = sub.toFixed(2);

    const impuestoPorc = parseFloat(impuestosEl.value || 0); // porcentaje
    const total = sub + (sub * impuestoPorc / 100);
    totalEl.textContent = total.toFixed(2);
  }

  impuestosEl.addEventListener("input", actualizarTotales);

  // 🔹 Enviar factura al backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const numero_factura = document.getElementById("numeroFactura").value;
    const fecha_emision = document.getElementById("fechaEmision").value;
    const cliente_id = document.getElementById("clienteSelect").value;
    const usuario_id = document.getElementById("usuarioSelect").value;
    const impuestos = parseFloat(impuestosEl.value || 0);
    const subtotal = parseFloat(subtotalEl.textContent || 0);
    const total = parseFloat(totalEl.textContent || 0);

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

    if (!numero_factura || !fecha_emision || !cliente_id || !usuario_id || items.length === 0) {
      alert("Por favor completa todos los campos y agrega al menos un ítem.");
      return;
    }

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

    console.log("📦 Enviando payload:", payload);

    try {
      const res = await fetch("/facturas/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("📩 Respuesta del servidor:", data);

      if (data.ok) {
        alert("✅ Factura registrada correctamente");
        window.location.href = "/facturas";
      } else {
        alert("❌ Error: " + (data.message || "No se pudo crear la factura"));
      }
    } catch (err) {
      console.error("Error enviando factura:", err);
      alert("Error al enviar la factura.");
    }
  });
});
