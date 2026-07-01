const formProducto = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");
const buscarAdmin = document.getElementById("buscarAdmin");
const totalProductos = document.getElementById("totalProductos");
const valorInventario = document.getElementById("valorInventario");
const tituloFormulario = document.getElementById("tituloFormulario");

let productosAdmin = [];

async function cargarProductosAdmin() {
    const respuesta = await apiObtenerProductos();

    if (!respuesta.ok) {
        tablaProductos.innerHTML = "<p>Error al cargar productos.</p>";
        return;
    }

    productosAdmin = respuesta.productos;
    mostrarTabla(productosAdmin);
    mostrarEstadisticas();
}

function mostrarEstadisticas() {
    totalProductos.textContent = productosAdmin.length;

    const valor = productosAdmin.reduce((total, p) => {
        return total + (Number(p.precio) * Number(p.stock));
    }, 0);

    valorInventario.textContent = "$" + valor.toFixed(2);
}

function mostrarTabla(lista) {
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    lista.forEach(p => {
        html += `
            <tr>
                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>$${Number(p.precio).toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>${p.categoria}</td>
                <td><span class="badge success">${p.estado}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editarProducto(${p.id_producto})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarProductoAdmin(${p.id_producto})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    tablaProductos.innerHTML = html;
}

formProducto.addEventListener("submit", async function(e) {
    e.preventDefault();

    const id = document.getElementById("id_producto").value;

    const datos = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value,
        id_categoria: document.getElementById("id_categoria").value,
        imagen: document.getElementById("imagen").value || "https://placehold.co/600x400/27ae60/ffffff?text=Producto",
        estado: document.getElementById("estado").value
    };

    let respuesta;

    if (id) {
        respuesta = await apiActualizarProducto(id, datos);
    } else {
        respuesta = await apiCrearProducto(datos);
    }

    alert(respuesta.mensaje);

    limpiarFormulario();
    cargarProductosAdmin();
});

function editarProducto(id) {
    const producto = productosAdmin.find(p => p.id_producto === id);

    document.getElementById("id_producto").value = producto.id_producto;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("id_categoria").value = producto.id_categoria;
    document.getElementById("imagen").value = producto.imagen;
    document.getElementById("estado").value = producto.estado;

    tituloFormulario.textContent = "✏️ Editar Producto";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function eliminarProductoAdmin(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) {
        return;
    }

    const respuesta = await apiEliminarProducto(id);

    alert(respuesta.mensaje);

    cargarProductosAdmin();
}

function limpiarFormulario() {
    formProducto.reset();
    document.getElementById("id_producto").value = "";
    tituloFormulario.textContent = "➕ Nuevo Producto";
}

buscarAdmin.addEventListener("input", function() {
    const texto = buscarAdmin.value.toLowerCase();

    const filtrados = productosAdmin.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto)
    );

    mostrarTabla(filtrados);
});

cargarProductosAdmin();