import express from "express";
import Producto from "../models/Producto.js";

const router = express.Router();

// Mostrar formulario + lista
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.render("productos", { title: "Gestión de Productos", productos });
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    res.status(500).send("Error al cargar productos");
  }
});

// Guardar nuevo producto
router.post("/nuevo", async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    await Producto.create({ nombre, descripcion, precio, stock });

    console.log("✅ Producto guardado correctamente");
    res.redirect("/productos");
  } catch (error) {
    console.error("❌ Error al guardar producto:", error);
    res.status(500).send("Error al guardar producto");
  }
});

export default router;

