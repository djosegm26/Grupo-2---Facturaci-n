import express from 'express';
import sequelize from './db/connection.js';
import path from 'path';
import { fileURLToPath } from "url";
import expressLayouts from 'express-ejs-layouts';

// 🔹 Importar rutas
import clienteRoutes from "./routes/clientes.js";
import productoRoutes from "./routes/productos.js"; 
import servicioRoutes from "./routes/servicios.js";

// 🧭 Configurar __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 1️⃣ Middleware para formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2️⃣ Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// 3️⃣ Archivos estáticos (CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 4️⃣ Rutas principales (sin duplicar productos ni servicios)
app.get('/', (req, res) => {
  res.render('login', { title: 'NeoForce - Inicio de Sesión' });
});

app.get('/index', (req, res) => {
  res.render('index', { title: 'NeoForce - Inicio' });
});

// 5️⃣ Rutas funcionales con Sequelize (CRUD)
app.use("/clientes", clienteRoutes);
app.use("/productos", productoRoutes);
app.use("/servicios", servicioRoutes);

// 6️⃣ Probar conexión con Sequelize (bloque async)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa');

    // Si las tablas no existen, puedes habilitar esto temporalmente:
    // await sequelize.sync({ alter: true });
    // console.log("📦 Tablas sincronizadas correctamente");

  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  }
})();

// 7️⃣ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


