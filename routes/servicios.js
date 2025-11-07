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

export default router;

