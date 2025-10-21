document.getElementById("btnSalir")?.addEventListener("click", () => {
  // Eliminar todos los datos de sesión
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");

  // Redirigir al login
  window.location.href = "index.html";
});