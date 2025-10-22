/*
-------------------------------------------
// stats.js
//
// muestra estadisticas de los cupones con seguridad
//
// Fecha: 13-Oct-2025
// Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/

// === FETCH SEGURO CON TOKEN ===
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


// === CARGAR ESTADISTICAS ===
async function cargarEstadisticas() {
    try {
        const data = await fetchSeguro('https://bj-api.site/beneficioJoven/stats');

        // Se espera un array con un objeto dentro
        const stats = data[0] ?? {};

        // Mostrar los valores en el HTML
        document.getElementById('total_cupones').textContent = stats.total_cupones ?? '0';
        document.getElementById('total_jovenes').textContent = stats.total_jovenes ?? '0';
        document.getElementById('total_comercios').textContent = stats.total_comercios ?? '0';
        document.getElementById('comercios_con_cupones').textContent = stats.comercios_con_cupones ?? '0';
        document.getElementById('cupones_asignados_a_jovenes').textContent = stats.cupones_asignados_a_jovenes ?? '0';
        document.getElementById('cupones_no_asignados').textContent = stats.cupones_no_asignados ?? '0';
        document.getElementById('total_redenciones').textContent = stats.total_redenciones ?? '0';
        document.getElementById('cupones_unicos_redimidos').textContent = stats.cupones_unicos_redimidos ?? '0';
    } catch (error) {
        console.error("❌ Error al cargar estadísticas:", error);
    }
}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarEstadisticas);