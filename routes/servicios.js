import express from "express";
import Servicio from "../models/Servicio.js";

const router = express.Router();

// Mostrar formulario + lista
router.get("/", async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.render("servicios", { title: "Gestión de Servicios", servicios });
  } catch (error) {
    console.error("❌ Error al cargar servicios:", error);
    res.status(500).send("Error al cargar servicios");
  }
});

// Guardar nuevo servicio
router.post("/nuevo", async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    await Servicio.create({ nombre, descripcion, precio });

    console.log("✅ Servicio guardado correctamente");
    res.redirect("/servicios");
  } catch (error) {
    console.error("❌ Error al guardar servicio:", error);
    res.status(500).send("Error al guardar servicio");
  }
});

// EDITAR - mostrar formulario
router.get("/editar/:id", async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).send("Servicio no encontrado");
    res.render("servicio-editar", { title: "Editar Servicio", servicio });
  } catch (err) {
    console.error(err); res.status(500).send("Error");
  }
});

// EDITAR - procesar
router.post("/editar/:id", async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).send("Servicio no encontrado");
    await servicio.update({ nombre, descripcion, precio });
    res.redirect("/servicios");
  } catch (err) {
    console.error(err); res.status(500).send("Error al actualizar");
  }
});

// ELIMINAR
router.post("/eliminar/:id", async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).send("Servicio no encontrado");
    await servicio.destroy();
    res.redirect("/servicios");
  } catch (err) {
    console.error(err); res.status(500).send("Error al eliminar");
  }
});


export default router;

