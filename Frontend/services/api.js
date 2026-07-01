const API_URL = "http://localhost:3000/api";

async function registrarUsuario(datos) {
    try {
        const respuesta = await fetch(`${API_URL}/auth/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        return await respuesta.json();
    } catch (error) {
        return {
            ok: false,
            mensaje: "No se pudo conectar con el servidor."
        };
    }
}

async function iniciarSesion(datos) {
    try {
        const respuesta = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        return await respuesta.json();
    } catch (error) {
        return {
            ok: false,
            mensaje: "No se pudo conectar con el servidor."
        };
    }
}

async function obtenerProductos() {
    try {
        const respuesta = await fetch(`${API_URL}/productos`);
        return await respuesta.json();
    } catch (error) {
        return {
            ok: false,
            productos: [],
            mensaje: "No se pudieron cargar los productos."
        };
    }
}

async function agregarProductoCarrito(datos) {
    const res = await fetch(`${API_URL}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    return await res.json();
}

async function obtenerCarrito(id_usuario) {
    const res = await fetch(`${API_URL}/carrito/${id_usuario}`);
    return await res.json();
}

async function eliminarProductoCarrito(id_detalle) {
    const res = await fetch(`${API_URL}/carrito/producto/${id_detalle}`, {
        method: "DELETE"
    });

    return await res.json();
}

async function vaciarCarritoBD(id_usuario) {
    const res = await fetch(`${API_URL}/carrito/vaciar/${id_usuario}`, {
        method: "DELETE"
    });

    return await res.json();
}
async function actualizarCantidadCarrito(datos) {
    const res = await fetch(`${API_URL}/carrito/cantidad`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    return await res.json();
}
async function confirmarCompraBD(id_usuario) {
    const res = await fetch(`${API_URL}/pedidos/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
    });

    return await res.json();
}

async function obtenerPedidosUsuario(id_usuario) {
    const res = await fetch(`${API_URL}/pedidos/usuario/${id_usuario}`);
    return await res.json();
}