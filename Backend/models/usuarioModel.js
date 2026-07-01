const conexion = require("../config/db");

const Usuario = {
    registrar(datos, callback) {
        const sql = `
            INSERT INTO usuarios
            (nombre, apellido, correo, telefono, direccion, password)
            VALUES (?,?,?,?,?,?)
        `;

        conexion.query(sql, [
            datos.nombre,
            datos.apellido,
            datos.correo,
            datos.telefono,
            datos.direccion,
            datos.password
        ], callback);
    },

    buscarPorCorreo(correo, callback) {
        const sql = "SELECT * FROM usuarios WHERE correo = ?";
        conexion.query(sql, [correo], callback);
    }
};

module.exports = Usuario;