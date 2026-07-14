const nombreUsuario = document.getElementById("nombreUsuario");
const correoUsuario = document.getElementById("correoUsuario");
const telefonoUsuario = document.getElementById("telefonoUsuario");
const direccionUsuario = document.getElementById("direccionUsuario");

function cargarPerfil() {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = "login.html";
        return;
    }

    let usuario;

    try {
        usuario = JSON.parse(usuarioGuardado);
    } catch (error) {
        console.error("Error al leer el usuario:", error);
        localStorage.removeItem("usuario");
        window.location.href = "login.html";
        return;
    }

    nombreUsuario.textContent =
        usuario.nombre ||
        usuario.nombre_usuario ||
        "Nombre no registrado";

    correoUsuario.textContent =
        usuario.correo ||
        usuario.email ||
        "Correo no registrado";

    telefonoUsuario.textContent =
        usuario.telefono ||
        "Teléfono no registrado";

    direccionUsuario.textContent =
        usuario.direccion ||
        "Dirección no registrada";
}

function editarPerfil() {
    alert("La edición del perfil se implementará en el siguiente paso.");
}

function cerrarSesion() {
    const confirmar = confirm("¿Deseas cerrar sesión?");

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    window.location.href = "login.html";
}

cargarPerfil();
