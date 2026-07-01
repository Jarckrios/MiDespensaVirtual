const Producto = require("../models/productoModel");

exports.obtenerProductos = (req, res) => {
    Producto.obtenerTodos((error, resultado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener productos.",
                error: error.message
            });
        }

        res.json({
            ok: true,
            productos: resultado
        });
    });
};

exports.crearProducto = (req, res) => {
    Producto.crear(req.body, (error, resultado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al crear producto.",
                error: error.message
            });
        }

        res.json({
            ok: true,
            mensaje: "Producto creado correctamente."
        });
    });
};

exports.actualizarProducto = (req, res) => {
    const id = req.params.id;

    Producto.actualizar(id, req.body, (error, resultado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al actualizar producto.",
                error: error.message
            });
        }

        res.json({
            ok: true,
            mensaje: "Producto actualizado correctamente."
        });
    });
};

exports.eliminarProducto = (req, res) => {
    const id = req.params.id;

    Producto.eliminar(id, (error, resultado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al eliminar producto.",
                error: error.message
            });
        }

        res.json({
            ok: true,
            mensaje: "Producto eliminado correctamente."
        });
    });
};