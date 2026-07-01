const Pedido = require("../models/pedidoModel");

exports.confirmarCompra = (req, res) => {
    const { id_usuario } = req.body;

    if (!id_usuario) {
        return res.json({
            ok: false,
            mensaje: "Falta el usuario."
        });
    }

    Pedido.obtenerCarrito(id_usuario, (error, carrito) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (carrito.length === 0) {
            return res.json({
                ok: false,
                mensaje: "El carrito está vacío."
            });
        }

        const subtotal = carrito.reduce((suma, item) => {
            return suma + Number(item.subtotal);
        }, 0);

        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        Pedido.crearPedido(id_usuario, total, (error, resultadoPedido) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: error.message
                });
            }

            const id_pedido = resultadoPedido.insertId;
            const numero_factura = "FAC-" + String(id_pedido).padStart(6, "0");

            carrito.forEach(item => {
                Pedido.crearDetallePedido(id_pedido, item, () => {});
            });

            Pedido.crearFactura({
                id_pedido,
                numero_factura,
                subtotal,
                iva,
                total
            }, (error, resultadoFactura) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: error.message
                    });
                }

                const id_factura = resultadoFactura.insertId;

                carrito.forEach(item => {
                    Pedido.crearDetalleFactura(id_factura, item, () => {});
                });

                Pedido.vaciarCarrito(id_usuario, () => {
                    res.json({
                        ok: true,
                        mensaje: "Compra confirmada. Factura generada.",
                        id_pedido,
                        id_factura,
                        numero_factura,
                        subtotal: subtotal.toFixed(2),
                        iva: iva.toFixed(2),
                        total: total.toFixed(2)
                    });
                });
            });
        });
    });
};

exports.obtenerPedidosUsuario = (req, res) => {
    const id_usuario = req.params.id_usuario;

    Pedido.obtenerPedidosUsuario(id_usuario, (error, pedidos) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (pedidos.length === 0) {
            return res.json({
                ok: true,
                pedidos: []
            });
        }

        const pedidosCompletos = [];
        let pendientes = pedidos.length;

        pedidos.forEach(pedido => {
            Pedido.obtenerDetallePedido(pedido.id_pedido, (error, detalles) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: error.message
                    });
                }

                pedidosCompletos.push({
                    ...pedido,
                    productos: detalles
                });

                pendientes--;

                if (pendientes === 0) {
                    res.json({
                        ok: true,
                        pedidos: pedidosCompletos
                    });
                }
            });
        });
    });
};