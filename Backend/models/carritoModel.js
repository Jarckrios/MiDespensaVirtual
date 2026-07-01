const conexion = require("../config/db");

const Carrito = {
    buscarCarrito(id_usuario, callback) {
        conexion.query(
            "SELECT * FROM carrito WHERE id_usuario = ?",
            [id_usuario],
            callback
        );
    },

    crearCarrito(id_usuario, callback) {
        conexion.query(
            "INSERT INTO carrito (id_usuario) VALUES (?)",
            [id_usuario],
            callback
        );
    },

    agregarProducto(datos, callback) {
        const sql = `
            INSERT INTO carrito_detalle
            (id_carrito, id_producto, cantidad, subtotal)
            VALUES (?, ?, ?, ?)
        `;

        conexion.query(sql, [
            datos.id_carrito,
            datos.id_producto,
            datos.cantidad,
            datos.subtotal
        ], callback);
    },

    obtenerDetalle(id_carrito, id_producto, callback) {
        conexion.query(
            "SELECT * FROM carrito_detalle WHERE id_carrito = ? AND id_producto = ?",
            [id_carrito, id_producto],
            callback
        );
    },

    actualizarCantidad(id_detalle, cantidad, subtotal, callback) {
        conexion.query(
            "UPDATE carrito_detalle SET cantidad = ?, subtotal = ? WHERE id_detalle = ?",
            [cantidad, subtotal, id_detalle],
            callback
        );
    },

    obtenerCarrito(id_usuario, callback) {
        const sql = `
            SELECT 
                cd.id_detalle,
                cd.id_producto,
                p.nombre,
                p.imagen,
                p.precio,
                cd.cantidad,
                cd.subtotal
            FROM carrito c
            INNER JOIN carrito_detalle cd ON c.id_carrito = cd.id_carrito
            INNER JOIN productos p ON cd.id_producto = p.id_producto
            WHERE c.id_usuario = ?
        `;

        conexion.query(sql, [id_usuario], callback);
    },

    eliminarProducto(id_detalle, callback) {
        conexion.query(
            "DELETE FROM carrito_detalle WHERE id_detalle = ?",
            [id_detalle],
            callback
        );
    },

    vaciarCarrito(id_usuario, callback) {
        const sql = `
            DELETE cd FROM carrito_detalle cd
            INNER JOIN carrito c ON cd.id_carrito = c.id_carrito
            WHERE c.id_usuario = ?
        `;

        conexion.query(sql, [id_usuario], callback);
    }
};

module.exports = Carrito;