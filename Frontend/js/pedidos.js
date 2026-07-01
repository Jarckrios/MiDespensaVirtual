const listaPedidos = document.getElementById("listaPedidos");
const sinPedidos = document.getElementById("sinPedidos");

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    alert("Debe iniciar sesión para ver sus pedidos.");
    window.location.href = "login.html";
}

const idUsuario = usuario.id || usuario.id_usuario;

async function mostrarPedidos() {
    listaPedidos.innerHTML = "";

    const respuesta = await obtenerPedidosUsuario(idUsuario);

    if (!respuesta.ok || respuesta.pedidos.length === 0) {
        sinPedidos.style.display = "block";
        return;
    }

    sinPedidos.style.display = "none";

    respuesta.pedidos.forEach(pedido => {
        let productosHTML = "";

        pedido.productos.forEach(producto => {
            productosHTML += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>$${Number(producto.precio).toFixed(2)}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${Number(producto.subtotal).toFixed(2)}</td>
                </tr>
            `;
        });

        listaPedidos.innerHTML += `
            <div class="card" style="margin-bottom:30px;">
                <div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;">
                    <div>
                        <h2>Pedido #${pedido.id_pedido}</h2>
                        <p><strong>Factura:</strong> ${pedido.numero_factura || "Sin factura"}</p>
                        <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString("es-EC")}</p>
                    </div>

                    <div>
                        <span class="badge warning">${pedido.estado}</span>
                    </div>
                </div>

                <br>

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${productosHTML}
                    </tbody>
                </table>

                <br>

                <div class="card oferta">
                    <div>
                        <h2>Total del pedido</h2>
                        <p>Subtotal: $${Number(pedido.subtotal).toFixed(2)}</p>
                        <p>IVA 15%: $${Number(pedido.iva).toFixed(2)}</p>
                    </div>

                    <h1>$${Number(pedido.total).toFixed(2)}</h1>
                </div>
            </div>
        `;
    });
}

mostrarPedidos();