const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;


// 1) Configuración de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts); // permite usar un layout principal


// 2) Archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// 3) Simular "base de datos" con JSON local
const productsPath = path.join(__dirname, 'data', 'products.json');
function loadProducts() {
const raw = fs.readFileSync(productsPath, 'utf8');
return JSON.parse(raw);
}


// 4) Rutas
app.get('/', (req, res) => {
res.render('login', { title: 'NeoForce Inicio '});
});

app.get('/index', (req, res) => {
res.render('index', { title: 'NeoForce Inicio '});
});

app.get('/clientes', (req, res) => {
//const products = loadProducts();
res.render('clientes', { title: 'clientes' });
});

app.get('/productos', (req, res) => {
res.render('productos', { title: 'productos' });
});

app.get('/servicios', (req, res) => {
res.render('servicios', { title: 'servicios' });
});

// 5) Iniciar servidor
app.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});