async function fetchSeguro(url, options = {}) {
    const token = localStorage.getItem("token");
    
    // Solo redirigir si no hay token
    if (!token) {
        window.location.href = "index.html"; // sin la /
        return; // detener la ejecución
    }

    options.headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    // Agregar token solo si existe
    options.headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, options);

    if (response.status === 401) throw new Error("Token requerido o inválido.");
    if (response.status === 403) throw new Error("No autorizado.");

    let data;
    try { data = await response.json(); } catch { data = {}; }

    if (!response.ok) throw new Error(data.error || data.message || "Error en la solicitud.");
    return data;
}
