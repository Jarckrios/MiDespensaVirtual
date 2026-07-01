const formulario = document.getElementById("registroForm");
const mensaje = document.getElementById("mensaje");
const checkMostrar = document.getElementById("mostrarPassword");

checkMostrar.addEventListener("change", function () {
    const password = document.getElementById("password");
    const confirmar = document.getElementById("confirmar");

    password.type = this.checked ? "text" : "password";
    confirmar.type = this.checked ? "text" : "password";
});

formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        password: document.getElementById("password").value
    };

    const confirmar = document.getElementById("confirmar").value;

    if (datos.nombre.length < 3) {
        mostrarMensaje("Ingrese un nombre válido.", "error");
        return;
    }

    if (datos.apellido.length < 3) {
        mostrarMensaje("Ingrese un apellido válido.", "error");
        return;
    }

    if (datos.correo === "") {
        mostrarMensaje("Ingrese un correo válido.", "error");
        return;
    }

    if (datos.telefono.length < 9) {
        mostrarMensaje("Ingrese un teléfono válido.", "error");
        return;
    }

    if (datos.direccion.length < 5) {
        mostrarMensaje("Ingrese una dirección válida.", "error");
        return;
    }

    if (datos.password.length < 8) {
        mostrarMensaje("La contraseña debe tener mínimo 8 caracteres.", "error");
        return;
    }

    if (datos.password !== confirmar) {
        mostrarMensaje("Las contraseñas no coinciden.", "error");
        return;
    }

    const respuesta = await registrarUsuario(datos);

    if (respuesta.ok) {
        mostrarMensaje("✅ Usuario registrado correctamente en MySQL.", "exito");

        formulario.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } else {
        mostrarMensaje(respuesta.mensaje || "Error al registrar usuario.", "error");
    }
});

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.style.color = tipo === "error" ? "#ff6b6b" : "#2ecc71";
}