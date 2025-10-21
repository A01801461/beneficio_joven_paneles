/*
-------------------------------------------
cupones.js
Lista, agrega y elimina cupones con seguridad
Fecha: 13-Oct-2025
Autores: Equipo 2 - Gpo 401
-------------------------------------------
*/

const modal = document.getElementById('modalAgregar');
const abrirModal = document.getElementById('abrirModal');
const cerrarModal = document.getElementById('cerrarModal');
const form = document.getElementById('formAgregar');
const table = document.getElementById("cuponesTable");
const buscador = document.getElementById("buscador");

const API_URL = "https://bj-api.site/beneficioJoven/coupons";

// === FETCH SEGURO CON TOKEN ===
async function fetchSeguro(url, options = {}) {
  const token = localStorage.getItem("token");
  window.location.href = "/index.html";
  options.headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) options.headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(url, options);

  if (response.status === 401) throw new Error("Token requerido o inválido.");
  if (response.status === 403) throw new Error("No autorizado.");

  let data;
  try { data = await response.json(); } catch { data = {}; }

  if (!response.ok) throw new Error(data.error || data.message || "Error en la solicitud.");
  return data;
}

// === MANEJO DE MODAL ===
abrirModal.addEventListener('click', () => modal.style.display = 'flex');
cerrarModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// === CARGAR CUPONES ===
async function cargarCupones() {
  try {
    const coupons = await fetchSeguro(API_URL);

    table.innerHTML = `
      <tr>
        <th>ID</th><th>Comercio</th><th>Código</th><th>Título</th>
        <th>Descripción</th><th>Válido hasta</th><th>Límite</th><th>Acciones</th>
      </tr>`;

    if (!coupons.length) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="8" class="no-data">No hay cupones registrados</td>`;
      table.appendChild(row);
      return;
    }

    coupons.forEach(coupon => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${coupon.coupon_id}</td>
        <td>${coupon.merchant_name}</td>
        <td>${coupon.code}</td>
        <td>${coupon.title}</td>
        <td>${coupon.description}</td>
        <td>${new Date(coupon.valid_until).toLocaleDateString()}</td>
        <td>${coupon.usage_limit}</td>
        <td>
          <button class="eliminar-btn" data-id="${coupon.coupon_id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      table.appendChild(row);
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (confirm(`¿Seguro que deseas eliminar el cupón con ID ${id}?`)) {
          await eliminarCupon(id);
        }
      });
    });

  } catch (err) {
    console.error("❌ Error al cargar cupones:", err);
    table.innerHTML = `<tr><td colspan="8" style="color:red;">⚠️ ${err.message}</td></tr>`;
  }
}

// === BUSCADOR ===
buscador.addEventListener("keyup", function() {
  const filtro = this.value.toLowerCase();
  const filas = table.getElementsByTagName("tr");

  for (let i = 1; i < filas.length; i++) {
    const celdas = filas[i].getElementsByTagName("td");
    let coincide = false;
    for (let j = 0; j < celdas.length; j++) {
      if (celdas[j].textContent.toLowerCase().includes(filtro)) {
        coincide = true;
        break;
      }
    }
    filas[i].style.display = coincide ? "" : "none";
  }
});

// === ELIMINAR CUPÓN ===
async function eliminarCupon(id) {
  try {
    await fetchSeguro(`${API_URL}/${id}`, { method: "DELETE" });
    alert("Cupón eliminado correctamente");
    cargarCupones();
  } catch (error) {
    console.error(error);
    alert("Hubo un error al eliminar el cupón: " + error.message);
  }
}

// === AGREGAR CUPÓN ===
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    await fetchSeguro(API_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    alert("Cupón agregado exitosamente");
    modal.style.display = 'none';
    form.reset();
    cargarCupones();
  } catch (error) {
    console.error(error);
    alert("Hubo un error al guardar el cupón: " + error.message);
  }
});

// === INICIO ===
cargarCupones();
