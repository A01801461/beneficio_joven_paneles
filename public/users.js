// users.js - PRUEBA RUTAS ALTERNATIVAS
async function cargarUsuarios() {
    try {
        console.log("🟡 Probando rutas alternativas...");
        
        // Intentar con las rutas que SABEMOS que existen
        const rutasSeguras = [
            "http://localhost:3000/beneficioJoven/admins",
            "http://localhost:3000/beneficioJoven/merchants", 
            "http://localhost:3000/beneficioJoven/jovenes",
            "http://localhost:3000/beneficioJoven/coupons"
        ];

        for (let ruta of rutasSeguras) {
            try {
                console.log(`🔍 Probando: ${ruta}`);
                let response = await fetch(ruta);
                
                if (response.ok) {
                    let datos = await response.json();
                    console.log(`✅ RUTA FUNCIONA: ${ruta}`, datos);
                    
                    // Si son usuarios, mostrarlos
                    if (Array.isArray(datos) && datos.length > 0 && datos[0].email) {
                        mostrarUsuariosReales(datos, ruta);
                        return;
                    }
                }
            } catch (error) {
                console.log(`❌ ${ruta}: ${error.message}`);
            }
        }
        
        // Si ninguna funciona, mostrar error específico
        mostrarErrorBackend();

    } catch (err) {
        console.error("Error:", err);
        mostrarErrorBackend();
    }
}

function mostrarErrorBackend() {
    let tabla = document.getElementById("usersBody");
    tabla.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; background: #f44336; color: white; padding: 20px;">
                <h3>🚨 ERROR DE BACKEND</h3>
                <p>La ruta <code>/beneficioJoven/allusers</code> no está funcionando.</p>
                <br>
                <p><strong>Acciones necesarias:</strong></p>
                <ol style="text-align: left; display: inline-block;">
                    <li>Verifica que el controlador <code>userController.listUsersPub</code> exista</li>
                    <li>Reinicia el servidor backend</li>
                    <li>Consulta los logs del backend para ver el error</li>
                </ol>
                <br>
                <button onclick="cargarUsuarios()" style="padding: 10px 20px; background: white; color: #f44336; border: none; border-radius: 5px;">
                    Reintentar
                </button>
            </td>
        </tr>
    `;
}

// Resto del código igual...
document.addEventListener("DOMContentLoaded", cargarUsuarios);