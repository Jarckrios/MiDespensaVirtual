const conexion = require("../config/db");

const Pedido = {
    obtenerCarrito(id_usuario, callback) {
        const sql = `
            SELECT 
                cd.id_producto,
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

    crearPedido(id_usuario, total, callback) {
        const sql = `
            INSERT INTO pedidos (id_usuario, total, estado)
            VALUES (?, ?, 'Pendiente')
        `;

        conexion.query(sql, [id_usuario, total], callback);
    },

    crearDetallePedido(id_pedido, item, callback) {
        const sql = `
            INSERT INTO detalle_pedidos
            (id_pedido, id_producto, cantidad, precio)
            VALUES (?, ?, ?, ?)
        `;

        conexion.query(sql, [
            id_pedido,
            item.id_producto,
            item.cantidad,
            item.precio
        ], callback);
    },

    crearFactura(datos, callback) {
        const sql = `
            INSERT INTO facturas
            (id_pedido, numero_factura, subtotal, iva, total)
            VALUES (?, ?, ?, ?, ?)
        `;

        conexion.query(sql, [
            datos.id_pedido,
            datos.numero_factura,
            datos.subtotal,
            datos.iva,
            datos.total
        ], callback);
    },

    crearDetalleFactura(id_factura, item, callback) {
        const sql = `
            INSERT INTO detalle_factura
            (id_factura, id_producto, cantidad, precio, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `;

        conexion.query(sql, [
            id_factura,
            item.id_producto,
            item.cantidad,
            item.precio,
            item.subtotal
        ], callback);
    },

    vaciarCarrito(id_usuario, callback) {
        const sql = `
            DELETE cd FROM carrito_detalle cd
            INNER JOIN carrito c ON cd.id_carrito = c.id_carrito
            WHERE c.id_usuario = ?
        `;

        conexion.query(sql, [id_usuario], callback);
    },

    obtenerPedidosUsuario(id_usuario, callback) {
        const sql = `
            SELECT 
                p.id_pedido,
                p.fecha,
                p.total,
                p.estado,
                f.numero_factura,
                f.subtotal,
                f.iva
            FROM pedidos p
            LEFT JOIN facturas f ON p.id_pedido = f.id_pedido
            WHERE p.id_usuario = ?
            ORDER BY p.id_pedido DESC
        `;

        conexion.query(sql, [id_usuario], callback);
    },

    obtenerDetallePedido(id_pedido, callback) {
        const sql = `
            SELECT 
                dp.id_producto,
                pr.nombre,
                pr.imagen,
                dp.cantidad,
                dp.precio,
                (dp.cantidad * dp.precio) AS subtotal
            FROM detalle_pedidos dp
            INNER JOIN productos pr ON dp.id_producto = pr.id_producto
            WHERE dp.id_pedido = ?
        `;

        conexion.query(sql, [id_pedido], callback);
    }
};

module.exports = Pedido;