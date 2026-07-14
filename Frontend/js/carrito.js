const tablaCarrito = document.getElementById("tablaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const carritoVacio = document.getElementById("carritoVacio");
const carritoContenido = document.getElementById("carritoContenido");

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    alert("Debe iniciar sesión para ver el carrito.");
    window.location.href = "login.html";
}

const idUsuario = usuario.id || usuario.id_usuario;

async function cargarCarrito() {
    try {
        const respuesta = await obtenerCarrito(idUsuario);

        tablaCarrito.innerHTML = "";

        if (!respuesta.ok || respuesta.carrito.length === 0) {
            carritoVacio.style.display = "block";
            carritoContenido.style.display = "none";
            return;
        }

        carritoVacio.style.display = "none";
        carritoContenido.style.display = "block";

        let total = 0;

        respuesta.carrito.forEach(producto => {
            total += Number(producto.subtotal);

            tablaCarrito.innerHTML += `
                <tr>
                    <td>${producto.nombre}</td>

                    <td>$${Number(producto.precio).toFixed(2)}</td>

                    <td>
                        <button
                            class="btn btn-warning"
                            onclick="cambiarCantidad(
                                ${producto.id_detalle},
                                ${Number(producto.cantidad) - 1},
                                ${Number(producto.precio)}
                            )"
                        >
                            -
                        </button>

                        <strong style="margin:0 12px;">
                            ${producto.cantidad}
                        </strong>

                        <button
                            class="btn"
                            onclick="cambiarCantidad(
                                ${producto.id_detalle},
                                ${Number(producto.cantidad) + 1},
                                ${Number(producto.precio)}
                            )"
                        >
                            +
                        </button>
                    </td>

                    <td>$${Number(producto.subtotal).toFixed(2)}</td>

                    <td>
                        <button
                            class="btn btn-danger"
                            onclick="eliminarProducto(${producto.id_detalle})"
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        totalCarrito.textContent = "$" + total.toFixed(2);

    } catch (error) {
        console.error("Error al cargar el carrito:", error);

        carritoVacio.style.display = "block";
        carritoContenido.style.display = "none";

        alert("No se pudo cargar el carrito.");
    }
}

async function cambiarCantidad(id_detalle, cantidad, precio) {
    try {
        const respuesta = await actualizarCantidadCarrito({
            id_detalle,
            cantidad,
            precio
        });

        alert(respuesta.mensaje);

        await cargarCarrito();

    } catch (error) {
        console.error("Error al actualizar la cantidad:", error);
        alert("No se pudo actualizar la cantidad.");
    }
}

async function eliminarProducto(id_detalle) {
    const confirmar = confirm("¿Eliminar este producto del carrito?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await eliminarProductoCarrito(id_detalle);

        alert(respuesta.mensaje);

        await cargarCarrito();

    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("No se pudo eliminar el producto.");
    }
}

async function vaciarCarrito() {
    const confirmar = confirm("¿Vaciar todo el carrito?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await vaciarCarritoBD(idUsuario);

        alert(respuesta.mensaje);

        await cargarCarrito();

    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        alert("No se pudo vaciar el carrito.");
    }
}

function abrirModalPago() {
    const modal = document.getElementById("modalPago");

    if (!modal) {
        alert("No se encontró la ventana de métodos de pago.");
        return;
    }

    modal.style.display = "flex";
}

function cerrarModalPago() {
    const modal = document.getElementById("modalPago");

    if (modal) {
        modal.style.display = "none";
    }
}

function actualizarMetodoPago() {
    const metodoSeleccionado = document.querySelector(
        'input[name="metodoPago"]:checked'
    );

    const datosTransferencia = document.getElementById("datosTransferencia");
    const datosTarjeta = document.getElementById("datosTarjeta");

    if (!metodoSeleccionado) {
        return;
    }

    const metodo = metodoSeleccionado.value;

    if (datosTransferencia) {
        datosTransferencia.style.display =
            metodo === "Transferencia bancaria" ? "block" : "none";
    }

    if (datosTarjeta) {
        datosTarjeta.style.display =
            metodo === "Tarjeta simulada" ? "block" : "none";
    }
}

function validarTarjeta() {
    const numeroTarjeta = document
        .getElementById("numeroTarjeta")
        .value
        .replace(/\s/g, "");

    const titularTarjeta = document
        .getElementById("titularTarjeta")
        .value
        .trim();

    const vencimientoTarjeta = document
        .getElementById("vencimientoTarjeta")
        .value
        .trim();

    const cvvTarjeta = document
        .getElementById("cvvTarjeta")
        .value
        .trim();

    if (!/^\d{16}$/.test(numeroTarjeta)) {
        alert("El número de tarjeta debe contener 16 dígitos.");
        return false;
    }

    if (titularTarjeta.length < 3) {
        alert("Ingrese el nombre completo del titular.");
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(vencimientoTarjeta)) {
        alert("Ingrese el vencimiento con el formato MM/AA.");
        return false;
    }

    const [mes] = vencimientoTarjeta.split("/").map(Number);

    if (mes < 1 || mes > 12) {
        alert("El mes de vencimiento no es válido.");
        return false;
    }

    if (!/^\d{3,4}$/.test(cvvTarjeta)) {
        alert("El CVV debe tener 3 o 4 dígitos.");
        return false;
    }

    return true;
}

async function procesarPago() {
    const metodoSeleccionado = document.querySelector(
        'input[name="metodoPago"]:checked'
    );

    if (!metodoSeleccionado) {
        alert("Selecciona un método de pago.");
        return;
    }

    const metodoPago = metodoSeleccionado.value;

    if (metodoPago === "Tarjeta simulada" && !validarTarjeta()) {
        return;
    }

    const confirmar = confirm(
        `¿Deseas finalizar la compra con el método "${metodoPago}"?`
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await confirmarCompraBD(idUsuario);

        if (!respuesta.ok) {
            alert(respuesta.mensaje || "No se pudo confirmar la compra.");
            return;
        }

        cerrarModalPago();

        alert(
            `✅ Compra confirmada\n\n` +
            `Método: ${metodoPago}\n` +
            `Factura: ${respuesta.numero_factura}\n` +
            `Subtotal: $${respuesta.subtotal}\n` +
            `IVA 15%: $${respuesta.iva}\n` +
            `Total: $${respuesta.total}`
        );

        window.location.href = "pedidos.html";

    } catch (error) {
        console.error("Error al procesar la compra:", error);
        alert("No se pudo procesar la compra.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelectorAll('input[name="metodoPago"]')
        .forEach(radio => {
            radio.addEventListener("change", actualizarMetodoPago);
        });

    const numeroTarjeta = document.getElementById("numeroTarjeta");

    if (numeroTarjeta) {
        numeroTarjeta.addEventListener("input", function () {
            const numeros = this.value
                .replace(/\D/g, "")
                .substring(0, 16);

            this.value = numeros.replace(/(\d{4})(?=\d)/g, "$1 ");
        });
    }

    const vencimientoTarjeta = document.getElementById("vencimientoTarjeta");

    if (vencimientoTarjeta) {
        vencimientoTarjeta.addEventListener("input", function () {
            const numeros = this.value
                .replace(/\D/g, "")
                .substring(0, 4);

            if (numeros.length > 2) {
                this.value = numeros.substring(0, 2) + "/" + numeros.substring(2);
            } else {
                this.value = numeros;
            }
        });
    }

    actualizarMetodoPago();
});

cargarCarrito();
