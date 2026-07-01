const formulario = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");
const checkMostrar = document.getElementById("mostrarPassword");

checkMostrar.addEventListener("change", function () {
    const password = document.getElementById("password");
    password.type = this.checked ? "text" : "password";
});

formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const datos = {
        correo: document.getElementById("correo").value.trim(),
        password: document.getElementById("password").value
    };

    if (datos.correo === "") {
        mostrarMensaje("Ingrese su correo.", "error");
        return;
    }

    if (datos.password.length < 8) {
        mostrarMensaje("La contraseña debe tener mínimo 8 caracteres.", "error");
        return;
    }

    const respuesta = await iniciarSesion(datos);

    if (respuesta.ok) {
        localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

        mostrarMensaje("✅ Inicio de sesión correcto.", "exito");

        setTimeout(() => {
            if (respuesta.usuario.rol === "Administrador") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "productos.html";
            }
        }, 1000);

    } else {
        mostrarMensaje(respuesta.mensaje || "Correo o contraseña incorrectos.", "error");
    }
});

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.style.color = tipo === "error" ? "#ff6b6b" : "#2ecc71";
}