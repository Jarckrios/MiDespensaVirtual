const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModel");

// REGISTRAR USUARIO
exports.registrar = async (req, res) => {
    try {
        const datos = req.body;

        const passwordEncriptada = await bcrypt.hash(datos.password, 10);

        datos.password = passwordEncriptada;

        Usuario.registrar(datos, (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al registrar usuario.",
                    error: error.message
                });
            }

            res.json({
                ok: true,
                mensaje: "Usuario registrado correctamente."
            });
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor.",
            error: error.message
        });
    }
};

// INICIAR SESIÓN
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        Usuario.buscarPorCorreo(correo, async (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error del servidor.",
                    error: error.message
                });
            }

            if (resultado.length === 0) {
                return res.json({
                    ok: false,
                    mensaje: "Correo o contraseña incorrectos."
                });
            }

            const usuario = resultado[0];

            const coincide = await bcrypt.compare(password, usuario.password);

            if (!coincide) {
                return res.json({
                    ok: false,
                    mensaje: "Correo o contraseña incorrectos."
                });
            }

            res.json({
                ok: true,
                mensaje: "Inicio de sesión correcto.",
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo,
                    telefono: usuario.telefono,
                    direccion: usuario.direccion,
                    rol: usuario.rol
                }
            });
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor.",
            error: error.message
        });
    }
};