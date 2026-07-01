const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    alert("Debe iniciar sesión.");
    window.location.href = "login.html";
}

if (usuario.rol !== "Administrador") {
    alert("Acceso denegado.\nSolo los administradores pueden ingresar a esta página.");
    window.location.href = "productos.html";
}