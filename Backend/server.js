require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conexion = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productoRoutes = require("./routes/productoRoutes");
const carritoRoutes = require("./routes/carritoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();

// ==========================
// MIDDLEWARES
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// RUTAS
// ==========================

app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidoRoutes);

// ==========================
// RUTA PRINCIPAL
// ==========================

app.get("/", (req, res) => {
    res.json({
        ok: true,
        mensaje: "🚀 API Mi Despensa Virtual funcionando correctamente"
    });
});

// ==========================
// CONEXIÓN MYSQL
// ==========================

conexion.connect((error) => {
    if (error) {
        console.log("❌ Error al conectar con MySQL:");
        console.log(error.message);
    } else {
        console.log("✅ Conectado correctamente a MySQL");
    }
});

// ==========================
// SERVIDOR
// ==========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});