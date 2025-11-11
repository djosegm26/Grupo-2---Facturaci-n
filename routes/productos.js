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

// Mostrar formulario de edición para un producto
router.get("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("producto-editar", { title: "Editar Producto", producto });
  } catch (error) {
    console.error("Error al cargar producto para edición:", error);
    res.status(500).send("Error del servidor");
  }
});

// Procesar edición (submit del formulario)
router.post("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    await producto.update({ nombre, descripcion, precio, stock });
    console.log("Producto actualizado:", id);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).send("Error al actualizar producto");
  }
});

// Eliminar producto (acción POST para compatibilidad con formularios)
router.post("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    await producto.destroy();
    console.log("Producto eliminado:", id);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error al eliminar producto");
  }
});


export default router;

