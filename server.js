// 🌱 Cargar variables de entorno
import dotenv from "dotenv";
dotenv.config(); // ⚠️ Siempre antes que cualquier otro import que use variables de entorno

// 📦 Importaciones principales
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import passport from "./passport/google.js";
import sequelize from "./db/connection.js";

// 🧩 Rutas
import authRoutes from "./routes/auth.js";
import usuarioRoutes from "./routes/usuarios.js";
import clienteRoutes from "./routes/clientes.js";
import productoRoutes from "./routes/productos.js";
import servicioRoutes from "./routes/servicios.js";
import facturaRoutes from "./routes/facturas.js";
import factusRoutes from "./routes/factus.js";



// 📁 Configurar __dirname (por ser módulo ES)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Inicializar app
const app = express();
const PORT = process.env.PORT || 3000;

//
// 🧠 CONFIGURACIÓN DE SESIÓN Y PASSPORT
//
app.use(
  session({
    secret: process.env.JWT_SECRET || "supersecret", // valor por defecto
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware global: pasar el usuario logueado a todas las vistas EJS
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//
// 🧱 MIDDLEWARES
//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Archivos estáticos

//
// 🎨 CONFIGURACIÓN DE EJS + LAYOUTS
//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // 👈 layout.ejs será el diseño base por defecto

//
// 🧭 RUTAS
//
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/productos", productoRoutes);
app.use("/servicios", servicioRoutes);
app.use("/facturas", facturaRoutes);
app.use("/factus", factusRoutes);


// 🌐 Página principal -> Login con layout personalizado
app.get("/", (req, res) => {
  res.render("login", { 
    title: "NeoForce - Inicio de Sesión",
    layout: "layout-login" // usa el layout minimalista
  });
});

// 🌐 Dashboard o página principal del sistema
app.get("/index", (req, res) => {
  // Si no está autenticado, redirige al login
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("index", { title: "NeoForce - Inicio" });
});

// 🚪 Cerrar sesión
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

//
// 💾 CONEXIÓN Y SINCRONIZACIÓN CON MYSQL
//
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa");

    // Sincronizar tablas según modelos
    await sequelize.sync({ alter: true });
    console.log("📦 Tablas sincronizadas correctamente");

    // 🚀 Iniciar servidor después de conectar a DB
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar o sincronizar la base de datos:", error);
  }
})();

