 /*
-------------------------------------------
 index.js

 maneja la logica del login.

 credenciales de admin:
 Usuario: admin.nuevo2@example.com
 Contraseña: NewAdmin123

 Fecha: 18-Oct-2025
 Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/  

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  // Limpiar mensajes de error anteriores
  const errorContainer = document.getElementById("error-container");
  errorContainer.style.display = "none";
  errorContainer.textContent = "";

  const usuario = document.getElementById("username").value.trim();
  const contrasena = document.getElementById("password").value.trim();

  if (!usuario || !contrasena) {
    showError("Por favor, llena todos los campos antes de continuar.");
    return;
  }

  try {
    const response = await fetch("https://bj-api.site/beneficioJoven/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: usuario,
        password: contrasena,
      }),
    });

    // Si la respuesta no es 2xx
    if (!response.ok) {
      let errorMsg = "Error desconocido";
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || "Credenciales inválidas";
      } catch {
        errorMsg = "Error de red o servidor";
      }
      showError(`Error: ${errorMsg}`);
      return;
    }

    // Procesar respuesta exitosa
    const data = await response.json();
    
    // Verificar estructura de respuesta
    if (!data.token || !data.role) {
      showError("Respuesta del servidor incompleta. Contacta al administrador.");
      console.error("Estructura de respuesta inválida:", data);
      return;
    }

    // Verificar roles permitidos
    const rolesPermitidos = ["super_admin", "admin"];
    if (!rolesPermitidos.includes(data.role)) {
      showError(`Acceso denegado. Solo usuarios con rol ${rolesPermitidos.join(" o ")} pueden acceder.`);
      console.warn("Rol no autorizado:", data.role);
      return;
    }

    // Guardar datos y redirigir
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userId", data.id);
    console.log("Login exitoso. Redirigiendo a statsAdmins.html...");
    window.location.href = "statsAdmins.html";

  } catch (error) {
    console.error("Error de conexión:", error);
    showError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
  }
});

// Función para mostrar errores en el contenedor
function showError(message) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = message;
  errorContainer.style.display = "block";
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    if (errorContainer.style.display === "block") {
      errorContainer.style.display = "none";
    }
  }, 15000);
}