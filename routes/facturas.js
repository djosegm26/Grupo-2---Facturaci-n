// ===================================================
// RUTAS DE FACTURAS
// Maneja listado, creación y visualización de facturas
// ===================================================
import express from "express";
import Factura from "../models/Factura.js";
import DetalleFactura from "../models/DetalleFactura.js";
import Cliente from "../models/Cliente.js";
import Producto from "../models/Producto.js";
import Servicio from "../models/Servicio.js";
import Usuario from "../models/Usuario.js";

const router = express.Router();


// ===================================================
// 1. LISTAR FACTURAS (vista principal)
// ===================================================
router.get("/", async (req, res) => {
  try {
    // Trae todas las facturas ordenadas por fecha reciente
    const facturas = await Factura.findAll({
      order: [["created_at", "DESC"]]
    });

    // Renderiza la vista con la lista de facturas
    res.render("facturas", { title: "Facturas", facturas });

  } catch (error) {
    console.error("Error al listar facturas:", error);
    res.status(500).send("Error al cargar facturas");
  }
});


// ===================================================
// 2. MOSTRAR FORMULARIO DE NUEVA FACTURA
// (carga clientes, productos, servicios, usuarios)
// ===================================================
router.get("/nuevo", async (req, res) => {
  try {
    // Cargar datos necesarios para el formulario
    const clientes = await Cliente.findAll();
    const productos = await Producto.findAll();
    const servicios = await Servicio.findAll();
    const usuarios = await Usuario.findAll();

    res.render("factura-nuevo", {
      title: "Nueva Factura",
      clientes,
      productos,
      servicios,
      usuarios
    });

  } catch (error) {
    console.error("Error al cargar datos para nueva factura:", error);
    res.status(500).send("Error al cargar formulario de factura");
  }
});


// ===================================================
// 3. CREAR FACTURA (POST) — recibe JSON del frontend
// ===================================================
router.post("/nuevo", async (req, res) => {
  try {
    // Se espera un JSON con datos de factura + ítems
    const {
      numero_factura,
      fecha_emision,
      cliente_id,
      usuario_id,
      impuestos,
      subtotal,
      total,
      items
    } = req.body;

    // Validaciones mínimas
    if (
      !numero_factura ||
      !fecha_emision ||
      !cliente_id ||
      !usuario_id ||
      !subtotal ||
      !total ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        ok: false,
        message: "Datos incompletos para crear factura"
      });
    }

    // Crear encabezado de la factura
    const factura = await Factura.create({
      numero_factura,
      fecha_emision,
      cliente_id,
      usuario_id,
      subtotal,
      impuestos: impuestos || 0,
      total,
      estado: "emitida"
    });

    // Crear cada ítem del detalle
    for (const it of items) {
      const detalle = {
        factura_id: factura.id,
        producto_id: it.producto_id || null,
        servicio_id: it.servicio_id || null,
        descripcion: it.descripcion || null,
        cantidad: it.cantidad,
        precio_unitario: it.precio_unitario,
        subtotal: it.subtotal
      };

      await DetalleFactura.create(detalle);
    }

    // Respuesta de éxito
    return res.json({ ok: true, facturaId: factura.id });

  } catch (error) {
    console.error("Error creando factura:", error);
    return res.status(500).json({
      ok: false,
      message: "Error creando factura"
    });
  }
});


// ===================================================
// 4. VER DETALLES DE UNA FACTURA ESPECÍFICA
// ===================================================
router.get("/ver/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Buscar la factura por ID
    const factura = await Factura.findByPk(id);
    if (!factura) return res.status(404).send("Factura no encontrada");

    // Obtener sus ítems asociados
    const detalles = await DetalleFactura.findAll({
      where: { factura_id: id }
    });

    // Renderizar vista con detalles
    res.render("factura-ver", {
      title: `Factura ${factura.numero_factura}`,
      factura,
      detalles
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar factura");
  }
});


// Exportamos todas las rutas
export default router;


