// === Verificación de acceso ===
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, regresar al login
    window.location.href = "index.html";
  }
});
