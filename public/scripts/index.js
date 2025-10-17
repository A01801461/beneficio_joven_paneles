document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuario = document.getElementById("username").value.trim();
  const contrasena = document.getElementById("password").value.trim();

  if (!usuario || !contrasena) {
    alert("Por favor, llena todos los campos antes de continuar.");
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
      }),s
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (!response.ok) {
      alert(data.message || "Usuario o contraseña incorrectos.");
      return;
    }

    // Verificar si llega el token
    if (!data.token) {
      alert("No se recibió token. Revisa la respuesta del servidor.");
      console.error("Respuesta inesperada:", data);
      return;
    }

    // Guardamos token y redirigimos
    localStorage.setItem("token", data.token);
    console.log("Login correcto. Token guardado, redirigiendo...");
    window.location.href = "statsAdmins.html";

  } catch (error) {
    console.error("Error de conexión o CORS:", error);
    alert("No se pudo conectar con el servidor. Intenta de nuevo.");
  }
});
