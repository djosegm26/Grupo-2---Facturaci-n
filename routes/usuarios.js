// ----------------------------------------------
//  RUTAS PARA GESTIÓN DE USUARIOS
// ----------------------------------------------

import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();


// ======================================================
// LISTAR TODOS LOS USUARIOS
// ======================================================
router.get("/", async (req, res) => {
  try {
    // Consulta todos los usuarios en la base de datos
    const usuarios = await Usuario.findAll();

    // Renderiza la vista "usuarios.ejs"
    res.render("usuarios", { 
      title: "Gestión de usuarios",
      usuarios 
    });

  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).send("Error al cargar la lista de usuarios.");
  }
});


// Exportar el router de usuarios
export default router;

