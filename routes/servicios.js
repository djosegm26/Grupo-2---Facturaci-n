// ----------------------------------------------
//  RUTAS PARA GESTIÓN DE SERVICIOS (CRUD)
// ----------------------------------------------

import express from "express";
import Servicio from "../models/Servicio.js";

// Crear enrutador dedicado para esta sección
const router = express.Router();


// ======================================================
// LISTAR SERVICIOS + MOSTRAR FORMULARIO PRINCIPAL
// ======================================================
router.get("/", async (req, res) => {
  try {
    const servicios = await Servicio.findAll(); // Obtiene todos los servicios

    // Renderiza la vista principal con la lista de servicios
    res.render("servicios", { 
      title: "Gestión de Servicios",
      servicios 
    });

  } catch (error) {
    console.error("❌ Error al cargar servicios:", error);
    res.status(500).send("Error al cargar servicios");
  }
});


// ======================================================
// GUARDAR NUEVO SERVICIO
// ======================================================
router.post("/nuevo", async (req, res) => {
  try {
    // Datos enviados desde un formulario HTML
    const { nombre, descripcion, precio } = req.body;

    // Inserta en la base de datos
    await Servicio.create({ nombre, descripcion, precio });

    console.log("✅ Servicio guardado correctamente");

    // Regresa a la lista
    res.redirect("/servicios");

  } catch (error) {
    console.error("❌ Error al guardar servicio:", error);
    res.status(500).send("Error al guardar servicio");
  }
});


// ======================================================
// EDITAR – MOSTRAR FORMULARIO DE EDICIÓN
// ======================================================
router.get("/editar/:id", async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id); // Busca por ID
    if (!servicio) return res.status(404).send("Servicio no encontrado");

    // Renderiza la vista con los datos cargados
    res.render("servicio-editar", { 
      title: "Editar Servicio",
      servicio 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar servicio");
  }
});


// ======================================================
// EDITAR – PROCESAR FORMULARIO
// ======================================================
router.post("/editar/:id", async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).send("Servicio no encontrado");

    // Actualiza el servicio seleccionado
    await servicio.update({ nombre, descripcion, precio });

    res.redirect("/servicios");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar");
  }
});


// ======================================================
// ELIMINAR SERVICIO
// ======================================================
router.post("/eliminar/:id", async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).send("Servicio no encontrado");

    await servicio.destroy(); // Elimina el registro de la BD

    res.redirect("/servicios");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar");
  }
});


// Exportar el conjunto de rutas
export default router;

