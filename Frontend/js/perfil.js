function editarPerfil() {
    alert("Más adelante conectaremos esta opción con MySQL para editar datos reales.");
}

function cerrarSesion() {
    if (confirm("¿Deseas cerrar sesión?")) {
        window.location.href = "login.html";
    }
}