/*
-------------------------------------------
// usuarios.js
//
// Lista y filtra usuarios (jóvenes y admins)
//
// Fecha: 20-Oct-2025
// Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/

const tablaUsuarios = document.getElementById("tablaUsuarios");
const encabezadoTabla = document.getElementById("encabezadoTabla");
const filtroSelect = document.getElementById("filtro-usuarios");
let usuariosActuales = [];

/* ==============================
   CARGAR USUARIOS DESDE SERVIDOR
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

  tablaUsuarios.innerHTML = "<tr><td colspan='4'>Cargando usuarios...</td></tr>";

  try {
    const response = await fetch(url);
    const data = await response.json().catch(() => ({})); // Por si no hay JSON

    if (!response.ok) {
      const mensaje =
        data?.message || data?.error || data?.detail || "Error al obtener datos del servidor.";
      throw new Error(mensaje);
    }

    usuariosActuales = data;
    renderTabla(data, tipo);

  } catch (error) {
    console.error("❌ Error desde el servidor:", error);
    tablaUsuarios.innerHTML = `<tr><td colspan='4' style='color:red; padding:10px;'>⚠️ ${error.message}</td></tr>`;
  }
}

/* ==============================
   RENDERIZAR TABLA
   ============================== */
function renderTabla(data, tipo) {
  encabezadoTabla.innerHTML = "";
  let columnas = [];

  if (tipo === "all") {
    columnas = ["ID", "Email", "Rol", "Fecha de creación"];
  } else if (tipo === "jovenes") {
    columnas = ["ID", "Nombre Completo", "CURP", "Nacimiento"];
  } else if (tipo === "admins") {
    columnas = ["ID", "Nombre", "Nivel de acceso"];
  }

  columnas.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    encabezadoTabla.appendChild(th);
  });

  if (!data || data.length === 0) {
    tablaUsuarios.innerHTML = `<tr><td colspan="${columnas.length}" style="padding:20px;">🔍 No se encontraron resultados</td></tr>`;
    return;
  }

  tablaUsuarios.innerHTML = data.map(u => {
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
  }).join("");
}

/* ==============================
   BUSCADOR
   ============================== */
document.getElementById("buscador").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const tipo = filtroSelect.value;
  const filtrados = usuariosActuales.filter((u) =>
    Object.values(u).some((val) =>
      String(val).toLowerCase().includes(texto)
    )
  );

  if (texto.trim() !== "") {
    renderTabla(filtrados, tipo);
    document.querySelectorAll("tbody tr").forEach(tr => tr.classList.add("destacado"));
  } else {
    renderTabla(usuariosActuales, tipo);
  }
});

/* ==============================
   FILTRO DE USUARIOS
   ============================== */
filtroSelect.addEventListener("change", (e) => {
  cargarUsuarios(e.target.value);
});

cargarUsuarios();
