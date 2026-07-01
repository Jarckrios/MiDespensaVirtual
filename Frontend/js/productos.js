const contenedor = document.getElementById("contenedorProductos");
const buscador = document.getElementById("buscarProducto");
const contadorCarrito = document.getElementById("contadorCarrito");

let productos = [];

async function cargarProductos() {
    const respuesta = await obtenerProductos();

    if (!respuesta.ok) {
        contenedor.innerHTML = `
            <div class="card">
                <h2>Error</h2>
                <p>No se pudieron cargar los productos.</p>
            </div>
        `;
        return;
    }

    productos = respuesta.productos;
    mostrarProductos(productos);
    actualizarContador();
}

function mostrarProductos(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="card">
                <h2>No hay productos</h2>
                <p>No se encontraron productos.</p>
            </div>
        `;
        return;
    }

    lista.forEach(producto => {
        contenedor.innerHTML += `
            <div class="producto animar">
                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="producto-body">
                    <span class="badge success">${producto.categoria || producto.estado}</span>

                    <h3>${producto.nombre}</h3>

                    <p>${producto.descripcion || "Producto disponible."}</p>

                    <p class="stock">Stock: ${producto.stock}</p>

                    <p class="precio">$${Number(producto.precio).toFixed(2)}</p>

                    <button class="btn" onclick="agregarCarrito(${producto.id_producto})">
                        Agregar al carrito
                    </button>

                </div>
            </div>
        `;
    });
}

async function agregarCarrito(id) {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Debe iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    const idUsuario = usuario.id || usuario.id_usuario;

    if (!idUsuario) {
        alert("No se encontró el usuario. Inicie sesión nuevamente.");
        return;
    }

    const producto = productos.find(p => Number(p.id_producto) === Number(id));

    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }

    try {

        const respuesta = await agregarProductoCarrito({

            id_usuario: idUsuario,
            id_producto: producto.id_producto,
            precio: Number(producto.precio)

        });

        alert(respuesta.mensaje);

        actualizarContador();

    } catch (error) {

        console.error(error);

        alert("Error al agregar el producto.");

    }

}

async function actualizarContador() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {

        if (contadorCarrito) {

            contadorCarrito.textContent = "🛒 0";

        }

        return;

    }

    const idUsuario = usuario.id || usuario.id_usuario;

    try {

        const respuesta = await obtenerCarrito(idUsuario);

        if (!respuesta.ok) {

            contadorCarrito.textContent = "🛒 0";

            return;

        }

        const total = respuesta.carrito.reduce((suma, item) => {

            return suma + Number(item.cantidad);

        }, 0);

        contadorCarrito.textContent = `🛒 ${total}`;

    } catch (error) {

        console.error(error);

        contadorCarrito.textContent = "🛒 0";

    }

}

buscador.addEventListener("input", function () {

    const texto = buscador.value.toLowerCase();

    const filtrados = productos.filter(producto =>

        producto.nombre.toLowerCase().includes(texto) ||

        (producto.descripcion || "").toLowerCase().includes(texto) ||

        (producto.categoria || "").toLowerCase().includes(texto)

    );

    mostrarProductos(filtrados);

});

if (contadorCarrito) {

    contadorCarrito.addEventListener("click", function () {

        window.location.href = "carrito.html";

    });

}

cargarProductos();