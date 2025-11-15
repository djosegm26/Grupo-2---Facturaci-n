// ===================================================
//   RUTAS DE GESTIÓN DE CLIENTES
// ===================================================
import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();


// ===================================================
// 1. Mostrar formulario + lista completa de clientes
// ===================================================
router.get("/", async (req, res) => {
  try {
    // Trae todos los clientes de la base de datos (MySQL)
    const clientes = await Cliente.findAll();

    // Renderiza la vista clientes.ejs con los datos
    res.render("clientes", { title: "Gestión de Clientes", clientes });

  } catch (error) {
    console.error("❌ Error al cargar clientes:", error);
    res.status(500).send("Error al cargar clientes");
  }
});


// ===================================================
// 2. Guardar nuevo cliente
// ===================================================
router.post("/nuevo", async (req, res) => {
  try {
    // Debug opcional para verificar lo enviado desde el formulario
    console.log("📥 Datos recibidos en el formulario:", req.body);

    const { nombre, identificacion, telefono, direccion, email } = req.body;

    // Crea el registro del cliente en la BD
    await Cliente.create({
      nombre,
      identificacion,
      telefono,
      direccion,
      email,
    });

    console.log("✅ Cliente guardado con éxito");

    // Vuelve a la vista de lista de clientes
    res.redirect("/clientes");

  } catch (error) {
    console.error("❌ Error al guardar cliente:", error);
    res.status(500).send("Error al guardar cliente");
  }
});


// ===================================================
// 3. Mostrar formulario para editar un cliente
// ===================================================
router.get("/editar/:id", async (req, res) => {
  try {
    // Buscar cliente por ID
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).send("Cliente no encontrado");

    // Renderizar formulario con datos actuales
    res.render("cliente-editar", {
      title: "Editar Cliente",
      cliente,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


// ===================================================
// 4. Procesar la edición del cliente
// ===================================================
router.post("/editar/:id", async (req, res) => {
  try {
    const { nombre, identificacion, telefono, email } = req.body;

    // Buscar cliente por ID
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).send("Cliente no encontrado");

    // Actualizar los campos permitidos
    await cliente.update({
      nombre,
      identificacion,
      telefono,
      email,
    });

    res.redirect("/clientes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar");
  }
});


// ===================================================
// 5. Eliminar un cliente
// ===================================================
router.post("/eliminar/:id", async (req, res) => {
  try {
    // Buscar cliente por ID
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).send("Cliente no encontrado");

    // Eliminar registro
    await cliente.destroy();

    res.redirect("/clientes");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar");
  }
});


// Exportar rutas
export default router;



