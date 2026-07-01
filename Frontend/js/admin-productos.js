const API_URL_ADMIN = "http://localhost:3000/api";

async function apiObtenerProductos() {
    const res = await fetch(`${API_URL_ADMIN}/productos`);
    return await res.json();
}

async function apiCrearProducto(datos) {
    const res = await fetch(`${API_URL_ADMIN}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
    return await res.json();
}

async function apiActualizarProducto(id, datos) {
    const res = await fetch(`${API_URL_ADMIN}/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
    return await res.json();
}

async function apiEliminarProducto(id) {
    const res = await fetch(`${API_URL_ADMIN}/productos/${id}`, {
        method: "DELETE"
    });
    return await res.json();
}