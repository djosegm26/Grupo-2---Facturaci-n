// routes/facturas.js
import express from "express";
import Factura from "../models/Factura.js";
import DetalleFactura from "../models/DetalleFactura.js";
import Cliente from "../models/Cliente.js";
import Producto from "../models/Producto.js";
import Servicio from "../models/Servicio.js";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// LISTAR facturas (vista principal)
router.get("/", async (req, res) => {
  try {
    const facturas = await Factura.findAll({
      order: [["created_at", "DESC"]]
    });
    res.render("facturas", { title: "Facturas", facturas });
  } catch (error) {
    console.error("Error al listar facturas:", error);
    res.status(500).send("Error al cargar facturas");
  }
});

// MOSTRAR formulario para nueva factura
router.get("/nuevo", async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    const productos = await Producto.findAll();
    const servicios = await Servicio.findAll();
    const usuarios = await Usuario.findAll();
    res.render("factura-nuevo", { title: "Nueva Factura", clientes, productos, servicios, usuarios });
  } catch (error) {
    console.error("Error al cargar datos para nueva factura:", error);
    res.status(500).send("Error al cargar formulario de factura");
  }
});

// CREAR nueva factura (recibe JSON con encabezado + items)
router.post("/nuevo", async (req, res) => {
  try {
    // Esperamos JSON: { numero_factura, fecha_emision, cliente_id, usuario_id, impuestos, subtotal, total, items: [{ producto_id, servicio_id, descripcion, cantidad, precio_unitario, subtotal }] }
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

    // Validaciones básicas
    if (!numero_factura || !fecha_emision || !cliente_id || !usuario_id || !subtotal || !total || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, message: "Datos incompletos para crear factura" });
    }

    // Crear encabezado
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

    // Crear detalles
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

    return res.json({ ok: true, facturaId: factura.id });
  } catch (error) {
    console.error("Error creando factura:", error);
    return res.status(500).json({ ok: false, message: "Error creando factura" });
  }
});

// OPCIONAL: ver detalles de una factura
router.get("/ver/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const factura = await Factura.findByPk(id);
    if (!factura) return res.status(404).send("Factura no encontrada");
    const detalles = await DetalleFactura.findAll({ where: { factura_id: id } });
    res.render("factura-ver", { title: `Factura ${factura.numero_factura}`, factura, detalles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar factura");
  }
});

export default router;

