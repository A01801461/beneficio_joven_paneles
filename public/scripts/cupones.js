/*
-------------------------------------------
// cupones.js
//
// Lista y filtra cupones
//
// Fecha: 13-Oct-2025
// Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/


    const modal = document.getElementById('modalAgregar');
    const abrirModal = document.getElementById('abrirModal');
    const cerrarModal = document.getElementById('cerrarModal');
    const form = document.getElementById('formAgregar');
    const table = document.getElementById("cuponesTable");

    const API_URL = "https://bj-api.site/beneficioJoven/coupons";

    abrirModal.addEventListener('click', () => modal.style.display = 'flex');
    cerrarModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

    async function cargarCupones() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los cupones");
        const coupons = await response.json();

        table.innerHTML = `
          <tr>
            <th>ID</th><th>Comercio</th><th>Código</th><th>Título</th>
            <th>Descripción</th><th>Válido hasta</th><th>Límite</th><th>Acciones</th>
          </tr>`;

        if (coupons.length === 0) {
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
        console.error(err);
      }
    }

    async function eliminarCupon(id) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar el cupón");
        alert("Cupón eliminado correctamente");
        cargarCupones();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al eliminar el cupón");
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al guardar el cupón");

        alert("Cupón agregado exitosamente");
        modal.style.display = 'none';
        form.reset();
        cargarCupones();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al guardar el cupón");
      }
    });

    cargarCupones();