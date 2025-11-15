// ----------------------------------------------
//  RUTAS PARA GESTIÓN DE PRODUCTOS (CRUD)
// ----------------------------------------------

import express from "express";
import Producto from "../models/Producto.js";

// Crea un enrutador independiente para todas las rutas de productos
const router = express.Router();


// ======================================================
// MOSTRAR FORMULARIO + LISTA DE PRODUCTOS
// ======================================================
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll(); // Obtiene todos los productos desde MySQL

    // Renderiza la vista "productos" enviando datos a la plantilla
    res.render("productos", { 
      title: "Gestión de Productos",
      productos 
    });

  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    res.status(500).send("Error al cargar productos");
  }
});


// ======================================================
// GUARDAR NUEVO PRODUCTO
// ======================================================
router.post("/nuevo", async (req, res) => {
  try {
    // Extraemos los valores enviados desde el formulario
    const { nombre, descripcion, precio, stock } = req.body;

    // Crea un registro nuevo en la BD
    await Producto.create({ nombre, descripcion, precio, stock });

    console.log("✅ Producto guardado correctamente");

    // Redirige nuevamente a la lista
    res.redirect("/productos");

  } catch (error) {
    console.error("❌ Error al guardar producto:", error);
    res.status(500).send("Error al guardar producto");
  }
});


// ======================================================
// MOSTRAR FORMULARIO PARA EDITAR UN PRODUCTO
// ======================================================
router.get("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params; // Obtiene ID desde la URL

    const producto = await Producto.findByPk(id); // Busca el producto por su clave primaria
    if (!producto) return res.status(404).send("Producto no encontrado");

    // Renderiza la vista para editar enviando el producto
    res.render("producto-editar", { 
      title: "Editar Producto",
      producto 
    });

  } catch (error) {
    console.error("Error al cargar producto para edición:", error);
    res.status(500).send("Error del servidor");
  }
});


// ======================================================
// PROCESAR FORMULARIO DE EDICIÓN
// ======================================================
router.post("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID del producto a actualizar
    const { nombre, descripcion, precio, stock } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    // Ejecuta la actualización
    await producto.update({ nombre, descripcion, precio, stock });

    console.log("Producto actualizado:", id);

    res.redirect("/productos");

  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).send("Error al actualizar producto");
  }
});


// ======================================================
// ELIMINAR PRODUCTO
// ======================================================
router.post("/eliminar/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID del producto a eliminar

    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    await producto.destroy(); // Elimina el registro de la BD

    console.log("Producto eliminado:", id);

    res.redirect("/productos");

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error al eliminar producto");
  }
});


// Exportamos el router para usarlo en app.js
export default router;


