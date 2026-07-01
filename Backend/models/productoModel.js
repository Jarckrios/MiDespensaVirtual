const conexion = require("../config/db");

const Producto = {
    obtenerTodos(callback) {
        const sql = `
            SELECT 
                p.*,
                c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto DESC
        `;

        conexion.query(sql, callback);
    },

    crear(datos, callback) {
        const sql = `
            INSERT INTO productos
            (id_categoria, nombre, descripcion, precio, stock, imagen, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        conexion.query(sql, [
            datos.id_categoria,
            datos.nombre,
            datos.descripcion,
            datos.precio,
            datos.stock,
            datos.imagen,
            datos.estado
        ], callback);
    },

    actualizar(id, datos, callback) {
        const sql = `
            UPDATE productos
            SET id_categoria=?, nombre=?, descripcion=?, precio=?, stock=?, imagen=?, estado=?
            WHERE id_producto=?
        `;

        conexion.query(sql, [
            datos.id_categoria,
            datos.nombre,
            datos.descripcion,
            datos.precio,
            datos.stock,
            datos.imagen,
            datos.estado,
            id
        ], callback);
    },

    eliminar(id, callback) {
        const sql = "DELETE FROM productos WHERE id_producto = ?";
        conexion.query(sql, [id], callback);
    }
};

module.exports = Producto;