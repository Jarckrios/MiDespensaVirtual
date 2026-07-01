const Carrito = require("../models/carritoModel");

exports.agregarAlCarrito = (req, res) => {
    const { id_usuario, id_producto, precio } = req.body;

    if (!id_usuario || !id_producto || !precio) {
        return res.json({
            ok: false,
            mensaje: "Faltan datos para agregar al carrito."
        });
    }

    Carrito.buscarCarrito(id_usuario, (error, carritos) => {
        if (error) {
            return res.status(500).json({ ok: false, mensaje: error.message });
        }

        const continuar = (id_carrito) => {
            Carrito.obtenerDetalle(id_carrito, id_producto, (error, detalles) => {
                if (error) {
                    return res.status(500).json({ ok: false, mensaje: error.message });
                }

                if (detalles.length > 0) {
                    const detalle = detalles[0];
                    const nuevaCantidad = detalle.cantidad + 1;
                    const nuevoSubtotal = nuevaCantidad * precio;

                    Carrito.actualizarCantidad(
                        detalle.id_detalle,
                        nuevaCantidad,
                        nuevoSubtotal,
                        (error) => {
                            if (error) {
                                return res.status(500).json({ ok: false, mensaje: error.message });
                            }

                            res.json({
                                ok: true,
                                mensaje: "Cantidad actualizada en el carrito."
                            });
                        }
                    );
                } else {
                    Carrito.agregarProducto({
                        id_carrito,
                        id_producto,
                        cantidad: 1,
                        subtotal: precio
                    }, (error) => {
                        if (error) {
                            return res.status(500).json({ ok: false, mensaje: error.message });
                        }

                        res.json({
                            ok: true,
                            mensaje: "Producto agregado al carrito."
                        });
                    });
                }
            });
        };

        if (carritos.length > 0) {
            continuar(carritos[0].id_carrito);
        } else {
            Carrito.crearCarrito(id_usuario, (error, resultado) => {
                if (error) {
                    return res.status(500).json({ ok: false, mensaje: error.message });
                }

                continuar(resultado.insertId);
            });
        }
    });
};

exports.verCarrito = (req, res) => {
    const id_usuario = req.params.id_usuario;

    Carrito.obtenerCarrito(id_usuario, (error, resultado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });
        }

        res.json({
            ok: true,
            carrito: resultado
        });
    });
};

exports.eliminarProducto = (req, res) => {
    const id_detalle = req.params.id_detalle;

    Carrito.eliminarProducto(id_detalle, (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });
        }

        res.json({
            ok: true,
            mensaje: "Producto eliminado del carrito."
        });
    });
};
exports.actualizarCantidad = (req, res) => {
    const { id_detalle, cantidad, precio } = req.body;

    if (cantidad <= 0) {
        return Carrito.eliminarProducto(id_detalle, (error) => {
            if (error) {
                return res.status(500).json({ ok: false, mensaje: error.message });
            }

            res.json({ ok: true, mensaje: "Producto eliminado del carrito." });
        });
    }

    const subtotal = cantidad * precio;

    Carrito.actualizarCantidad(id_detalle, cantidad, subtotal, (error) => {
        if (error) {
            return res.status(500).json({ ok: false, mensaje: error.message });
        }

        res.json({ ok: true, mensaje: "Cantidad actualizada." });
    });
};
exports.vaciarCarrito = (req, res) => {
    const id_usuario = req.params.id_usuario;

    Carrito.vaciarCarrito(id_usuario, (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });
        }

        res.json({
            ok: true,
            mensaje: "Carrito vaciado correctamente."
        });
    });
};