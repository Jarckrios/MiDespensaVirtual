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
                        onclick="cambiarCantidad(${producto.id_detalle}, ${Number(producto.cantidad) - 1}, ${Number(producto.precio)})">
                        -
                    </button>

                    <strong style="margin:0 12px;">
                        ${producto.cantidad}
                    </strong>

                    <button 
                        class="btn" 
                        onclick="cambiarCantidad(${producto.id_detalle}, ${Number(producto.cantidad) + 1}, ${Number(producto.precio)})">
                        +
                    </button>
                </td>

                <td>$${Number(producto.subtotal).toFixed(2)}</td>

                <td>
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.id_detalle})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    totalCarrito.textContent = "$" + total.toFixed(2);
}

async function cambiarCantidad(id_detalle, cantidad, precio) {
    const respuesta = await actualizarCantidadCarrito({
        id_detalle,
        cantidad,
        precio
    });

    alert(respuesta.mensaje);

    cargarCarrito();
}

async function eliminarProducto(id_detalle) {
    if (!confirm("¿Eliminar este producto del carrito?")) {
        return;
    }

    const respuesta = await eliminarProductoCarrito(id_detalle);

    alert(respuesta.mensaje);

    cargarCarrito();
}

async function vaciarCarrito() {
    if (!confirm("¿Vaciar todo el carrito?")) {
        return;
    }

    const respuesta = await vaciarCarritoBD(idUsuario);

    alert(respuesta.mensaje);

    cargarCarrito();
}

async function confirmarCompra() {
    const respuesta = await confirmarCompraBD(idUsuario);

    if (respuesta.ok) {
        alert(
            `✅ Compra confirmada\n\nFactura: ${respuesta.numero_factura}\nSubtotal: $${respuesta.subtotal}\nIVA 15%: $${respuesta.iva}\nTotal: $${respuesta.total}`
        );

        window.location.href = "pedidos.html";
    } else {
        alert(respuesta.mensaje);
    }
}

cargarCarrito();