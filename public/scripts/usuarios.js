//-------------------------------------------
// usuarios.js
// Fecha: 20-Oct-2025
// Autores: Equipo 2 - Gpo 401
//-------------------------------------------

const tablaUsuarios = document.getElementById("tablaUsuarios");
const encabezadoTabla = document.getElementById("encabezadoTabla");
const filtroSelect = document.getElementById("filtro-usuarios");
const btnAgregarAdmin = document.getElementById("btn-agregar-admin");
const modalAdmin = document.getElementById("modalAgregarAdmin");
const cancelarAdmin = document.getElementById("cancelarAdmin");
const guardarAdmin = document.getElementById("guardarAdmin");
let usuariosActuales = [];

/* ==============================
   CARGAR USUARIOS (CON SEGURIDAD)
   ============================== */
async function cargarUsuarios(tipo = "all") {
  const baseUrl = "https://bj-api.site/beneficioJoven";
  let url;

  switch (tipo) {
    case "jovenes":
      url = `${baseUrl}/jovenes`;
      break;
    case "admins":
      url = `${baseUrl}/admins`;
      break;
    default:
      url = `${baseUrl}/allusers`;
  }

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  tablaUsuarios.innerHTML = "<tr><td colspan='4'>Cargando usuarios...</td></tr>";

  try {
    const response = await fetch(url, { method: "GET", headers });

    // Seguridad: manejo de tokens y permisos
    if (response.status === 401) throw new Error("Token requerido o inválido. Inicia sesión.");
    if (response.status === 403) throw new Error("No autorizado: rol insuficiente.");

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || data?.message || "Error al obtener usuarios.");

    usuariosActuales = data;
    renderTabla(data, tipo);
  } catch (error) {
    console.error("❌ Error desde el servidor:", error);

    if (error.message.includes("Token")) {
      localStorage.removeItem("token");
      window.location.href = "/index.html";
      return;
    }

    tablaUsuarios.innerHTML = `<tr><td colspan='4' style='color:red;'>⚠️ ${error.message}</td></tr>`;
  }
}

/* ==============================
   RENDERIZAR TABLA
   ============================== */
function renderTabla(data, tipo) {
  encabezadoTabla.innerHTML = "";
  let columnas = [];

  if (tipo === "all") columnas = ["ID", "Email", "Rol", "Fecha de creación"];
  else if (tipo === "jovenes") columnas = ["ID", "Nombre Completo", "CURP", "Nacimiento"];
  else if (tipo === "admins") columnas = ["ID", "Nombre", "Nivel de acceso"];

  columnas.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col;
    encabezadoTabla.appendChild(th);
  });

  if (!data || data.length === 0) {
    tablaUsuarios.innerHTML = `<tr><td colspan="${columnas.length}" style="padding:20px;">🔍 No se encontraron resultados</td></tr>`;
    return;
  }

  tablaUsuarios.innerHTML = data
    .map((u) => {
      if (tipo === "all") {
        return `<tr>
          <td>${u.id}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>${new Date(u.created_at).toLocaleDateString()}</td>
        </tr>`;
      } else if (tipo === "jovenes") {
        return `<tr>
          <td>${u.user_id}</td>
          <td>${u.full_name || "-"}</td>
          <td>${u.curp || "-"}</td>
          <td>${u.birth_date || "-"}</td>
        </tr>`;
      } else if (tipo === "admins") {
        return `<tr>
          <td>${u.user_id}</td>
          <td>${u.full_name || "-"}</td>
          <td>${u.is_super_admin ? "Super Admin" : "Admin"}</td>
        </tr>`;
      }
    })
    .join("");
}

/* ==============================
   BUSCADOR
   ============================== */
document.getElementById("buscador").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const tipo = filtroSelect.value;
  const filtrados = usuariosActuales.filter((u) =>
    Object.values(u).some((val) => String(val).toLowerCase().includes(texto))
  );
  renderTabla(texto.trim() ? filtrados : usuariosActuales, tipo);
});

/* ==============================
   FILTRO
   ============================== */
filtroSelect.addEventListener("change", (e) => {
  const tipo = e.target.value;
  cargarUsuarios(tipo);
  // Mostrar botón de agregar solo en admins
  btnAgregarAdmin.style.display = tipo === "admins" ? "inline-block" : "none";
});

/* ==============================
   MODAL
   ============================== */
btnAgregarAdmin.addEventListener("click", () => {
  modalAdmin.style.display = "flex";
});

cancelarAdmin.addEventListener("click", () => {
  modalAdmin.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modalAdmin) modalAdmin.style.display = "none";
});

/* ==============================
   GUARDAR ADMIN (CON SEGURIDAD)
   ============================== */
guardarAdmin.addEventListener("click", async () => {
  const email = document.getElementById("emailAdmin").value.trim();
  const password = document.getElementById("passwordAdmin").value.trim();
  const fullName = document.getElementById("nombreAdmin").value.trim();
  const isSuperAdmin = document.querySelector('input[name="superAdmin"]:checked').value === "true";

  if (!email || !password || !fullName) {
    alert("⚠️ Por favor completa todos los campos.");
    return;
  }

  const NEW_ADMIN_DATA = {
    email,
    password,
    role: "admin",
    profileData: {
      full_name: fullName,
      is_super_admin: isSuperAdmin,
    },
  };

  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Token no encontrado. Inicia sesión nuevamente.");
    window.location.href = "/index.html";
    return;
  }

  try {
    const response = await fetch("https://bj-api.site/beneficioJoven/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(NEW_ADMIN_DATA),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      console.error("⚠️ Respuesta no-JSON del servidor:", text);
      throw new Error("El servidor devolvió HTML en lugar de JSON. Verifica el endpoint o permisos.");
    }

    if (!response.ok) throw new Error(data.error || data.message || "❌ No se pudo crear el admin.");

    alert("✅ Admin agregado correctamente.");
    modalAdmin.style.display = "none";
    document.getElementById("formAdmin").reset();
    await cargarUsuarios("admins");
  } catch (error) {
    console.error("❌ Error al agregar admin:", error);
    alert("❌ " + error.message);
  }
});

/* ==============================
   INICIALIZACIÓN
   ============================== */
cargarUsuarios();
btnAgregarAdmin.style.display = "none";
