 /*
-------------------------------------------
// stats.js
//
// muestra estadisticas de los cupones.
//
// Fecha: 13-Oct-2025
// Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/      
       
       async function cargarEstadisticas() {
            try {
                const respuesta = await fetch('https://bj-api.site/beneficioJoven/stats');
                if (!respuesta.ok) throw new Error('Error al obtener datos del servidor');
                const data = await respuesta.json();

                // Se espera un array con un objeto dentro
                const stats = data[0];

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
                console.error(error);
                alert("No se pudieron cargar las estadísticas. Intenta más tarde.");
            }
        }

        // Llama a la función al cargar la página
        document.addEventListener("DOMContentLoaded", cargarEstadisticas);