/*
-------------------------------------------
 comercios.js
 Lista y administra comercios con seguridad
 Fecha: 20-Oct-2025
 Autores: Equipo 2 - Gpo 401
-------------------------------------------
*/

const tablaComercios = document.getElementById("tablaComercios");
let comerciosActuales = [];

// === FETCH SEGURO CON TOKEN ===
async function fetchSeguro(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  options.headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  options.headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, options);

  if (response.status === 401) throw new Error("Token requerido o inválido.");
  if (response.status === 403) throw new Error("No autorizado.");

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) throw new Error(data.error || data.message || "Error en la solicitud.");
  return data;
}

/* ==============================
   CARGAR COMERCIOS
   ============================== */
async function cargarComercios() {
  const url = "https://bj-api.site/beneficioJoven/merchants";
  tablaComercios.innerHTML = "<tr><td colspan='6'>Cargando comercios...</td></tr>";

  try {
    const data = await fetchSeguro(url);
    comerciosActuales = data;
    renderTablaComercios(data);
  } catch (error) {
    console.error("❌ Error al cargar comercios:", error);
    tablaComercios.innerHTML = `<tr><td colspan='6' style='color:red;'>⚠️ ${error.message}</td></tr>`;
  }
}

/* ==============================
   RENDERIZAR TABLA
   ============================== */
function renderTablaComercios(data) {
  if (!data || data.length === 0) {
    tablaComercios.innerHTML = `<tr><td colspan="6">🔍 No se encontraron comercios</td></tr>`;
    return;
  }

  tablaComercios.innerHTML = data
    .map(
      (c) => `
    <tr>
      <td>${c.user_id}</td>
      <td>${c.merchant_name}</td>
      <td>${c.description}</td>
      <td><img src="${c.logo_url}" alt="logo" style="max-height:40px;"></td>
      <td>${c.merchant_type}</td>
      <td>
        <button class="eliminar-btn" data-id="${c.user_id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>`
    )
    .join("");

  // Asignar eventos a los botones eliminar
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm(`¿Seguro que deseas eliminar el comercio con ID ${id}?`)) {
        await eliminarComercio(id);
      }
    });
  });
}

/* ==============================
   ELIMINAR COMERCIO
   ============================== */
async function eliminarComercio(id) {
  try {
    await fetchSeguro(`https://bj-api.site/beneficioJoven/merchants/${id}`, {
      method: "DELETE",
    });
    alert("Comercio eliminado correctamente.");
    cargarComercios(); // recargar lista
  } catch (error) {
    console.error("❌ Error al eliminar comercio:", error);
    alert("No se pudo eliminar el comercio: " + error.message);
  }
}

/* ==============================
   BUSCADOR
   ============================== */
document.getElementById("buscadorComercio").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = comerciosActuales.filter((c) =>
    Object.values(c).some((val) => String(val).toLowerCase().includes(texto))
  );

  renderTablaComercios(texto.trim() ? filtrados : comerciosActuales);
});

/* ==============================
   MODAL NUEVO COMERCIO
   ============================== */
const modalComercio = document.getElementById("modalComercio");
const abrirModalComercio = document.getElementById("abrirModalComercio");
const cerrarModalComercio = document.getElementById("cerrarModalComercio");
const formComercio = document.getElementById("formComercio");

abrirModalComercio.addEventListener("click", () =>
  modalComercio.classList.add("show")
);
cerrarModalComercio.addEventListener("click", () => {
  modalComercio.classList.remove("show");
  formComercio.reset();
});
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
      merchant_type: document.getElementById("merchant_type").value.trim(),
    },
  };

  try {
    await fetchSeguro("https://bj-api.site/beneficioJoven/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    alert("✅ Comercio agregado exitosamente.");
    modalComercio.classList.remove("show");
    formComercio.reset();
    cargarComercios();
  } catch (err) {
    console.error("❌ Error al registrar comercio:", err);
    alert("No se pudo agregar el comercio: " + err.message);
  }
});

// === INICIO ===
cargarComercios();
