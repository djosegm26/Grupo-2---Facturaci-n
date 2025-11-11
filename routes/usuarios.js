import express from "express";
import  Usuario  from "../models/Usuario.js";

const router = express.Router();

// Mostrar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render("usuarios", { title: "Gestión de usuarios", usuarios});
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).send("Error al cargar la lista de usuarios.");
  }
});

export default router;
