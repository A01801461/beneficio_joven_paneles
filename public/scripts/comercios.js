/*
-------------------------------------------
// comercios.js
//
// Lista y administra comercios
//
// Fecha: 20-Oct-2025
// Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/

const tablaComercios = document.getElementById("tablaComercios");
const encabezadoTablaComercios = document.getElementById("encabezadoTablaComercios");
let comerciosActuales = [];

/* ==============================
   CARGAR COMERCIOS DESDE SERVIDOR
   ============================== */
async function cargarComercios() {
  const url = "https://bj-api.site/beneficioJoven/merchants";
  tablaComercios.innerHTML = "<tr><td colspan='5'>Cargando comercios...</td></tr>";

  try {
    const response = await fetch(url);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const mensaje =
        data?.message || data?.error || data?.detail || "Error al obtener comercios.";
      throw new Error(mensaje);
    }

    comerciosActuales = data;
    renderTablaComercios(data);

  } catch (error) {
    console.error("❌ Error al cargar comercios:", error);
    tablaComercios.innerHTML = `<tr><td colspan='5' style='color:red;'>⚠️ ${error.message}</td></tr>`;
  }
}

/* ==============================
   RENDERIZAR TABLA
   ============================== */
function renderTablaComercios(data) {
  if (!data || data.length === 0) {
    tablaComercios.innerHTML = `<tr><td colspan="5">🔍 No se encontraron comercios</td></tr>`;
    return;
  }

  tablaComercios.innerHTML = data.map(c => `
    <tr>
      <td>${c.user_id}</td>
      <td>${c.merchant_name}</td>
      <td>${c.description}</td>
      <td><img src="${c.logo_url}" alt="logo" style="max-height:40px;"></td>
      <td>${c.merchant_type}</td>
    </tr>
  `).join("");
}

/* ==============================
   BUSCADOR
   ============================== */
document.getElementById("buscadorComercio").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = comerciosActuales.filter((c) =>
    Object.values(c).some((val) => String(val).toLowerCase().includes(texto))
  );

  if (texto.trim() !== "") {
    renderTablaComercios(filtrados);
    document.querySelectorAll("tbody tr").forEach(tr => tr.classList.add("destacado"));
  } else {
    renderTablaComercios(comerciosActuales);
  }
});

/* ==============================
   MODAL NUEVO COMERCIO
   ============================== */
const modalComercio = document.getElementById("modalComercio");
const abrirModalComercio = document.getElementById("abrirModalComercio");
const cerrarModalComercio = document.getElementById("cerrarModalComercio");
const formComercio = document.getElementById("formComercio");

// Abrir modal
abrirModalComercio.addEventListener("click", () => {
  modalComercio.classList.add("show");
});

// Cerrar modal
cerrarModalComercio.addEventListener("click", () => {
  modalComercio.classList.remove("show");
  formComercio.reset();
});

// Cerrar si se hace clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modalComercio) {
    modalComercio.classList.remove("show");
    formComercio.reset();
  }
});

/* ==============================
   REGISTRO DE NUEVO COMERCIO
   ============================== */
formComercio.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    role: "merchant",
    profileData: {
      merchant_name: document.getElementById("merchant_name").value.trim(),
      description: document.getElementById("description").value.trim(),
      logo_url: document.getElementById("logo_url").value.trim(),
      merchant_type: document.getElementById("merchant_type").value.trim()
    }
  };

  try {
    const response = await fetch("https://bj-api.site/beneficioJoven/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const mensaje =
        data?.message || data?.error || data?.detail || "Error al agregar comercio.";
      throw new Error(mensaje);
    }

    alert("✅ Comercio agregado exitosamente.");
    modalComercio.classList.remove("show");
    formComercio.reset();
    cargarComercios();

  } catch (err) {
    console.error("❌ Error al registrar comercio:", err);
    alert("No se pudo agregar el comercio: " + err.message);
  }
});

cargarComercios();
