import express from "express";
import Cliente from "../models/Cliente.js";

const router = express.Router();

// 🔹 Mostrar formulario y lista de clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.findAll(); // Trae datos reales de MySQL
    res.render("clientes", { title: "Gestión de Clientes", clientes });
  } catch (error) {
    console.error("❌ Error al cargar clientes:", error);
    res.status(500).send("Error al cargar clientes");
  }
});

// 🔹 Guardar nuevo cliente
router.post("/nuevo", async (req, res) => {
  try {
    console.log("📥 Datos recibidos en el formulario:", req.body); // 👈 agrega esto

    const { nombre, identificacion, telefono, direccion, email } = req.body;

    await Cliente.create({
      nombre,
      identificacion,
      telefono,
      direccion,
      email,
    });

    console.log("✅ Cliente guardado con éxito");
    res.redirect("/clientes");
  } catch (error) {
    console.error("❌ Error al guardar cliente:", error);
    res.status(500).send("Error al guardar cliente");
  }
});


export default router;


