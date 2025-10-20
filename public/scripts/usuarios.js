/*
-------------------------------------------
// usuarios.js
//
// Lista y filtra usuarios
//
// Fecha: 13-Oct-2025
// Autores: Equipo 2 - Gpo 401
---------------------------------------------
*/

    const tablaUsuarios = document.getElementById("tablaUsuarios");
    const encabezadoTabla = document.getElementById("encabezadoTabla");
    const filtroSelect = document.getElementById("filtro-usuarios");
    let usuariosActuales = [];

    async function cargarUsuarios(tipo = "all") {
      const baseUrl = "https://bj-api.site/beneficioJoven";
      let url;

      switch (tipo) {
        case "jovenes":
          url = `${baseUrl}/jovenes`;
          break;
        case "merchants":
          url = `${baseUrl}/merchants`;
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
        if (!response.ok) throw new Error("Error al obtener datos");
        const data = await response.json();
        usuariosActuales = data;

        renderTabla(data, tipo);
      } catch (error) {
        console.error(error);
        tablaUsuarios.innerHTML = "<tr><td colspan='4'>Error al cargar datos</td></tr>";
      }
    }


    function renderTabla(data, tipo) {
      encabezadoTabla.innerHTML = "";
      let columnas = [];

      if (tipo === "all") {
        columnas = ["ID", "Email", "Rol", "Fecha de creación"];
      } else if (tipo === "jovenes") {
        columnas = ["ID", "Nombre Completo", "CURP", "Nacimiento", "Municipio"];
      } else if (tipo === "merchants") {
        columnas = ["ID", "Comercio", "Descripción", "Logo", "Tipo"];
      } else if (tipo === "admins") {
        columnas = ["ID", "Nombre", "Nivel de acceso"];
      }

      columnas.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        encabezadoTabla.appendChild(th);
      });

      if (data.length === 0) {
        tablaUsuarios.innerHTML = `<tr><td colspan="${columnas.length}" style="padding:20px;">🔍 No se encontraron resultados</td></tr>`;
        return;
      }

      tablaUsuarios.innerHTML = data.map(u => {
        if (tipo === "all") {
          return `<tr>
              <td>${u.id}</td>
              
              <td>${u.email}</td>
              <td>${u.role}</td>
              <td>${new Date(u.created_at).toLocaleString()}</td>
            </tr>`;
        } else if (tipo === "jovenes") {
          return `<tr>
              <td>${u.user_id}</td>
              <td>${u.full_name || "-"}</td>
              <td>${u.curp || "-"}</td>
              <td>${u.birth_date || "-"}</td>
              <td>${u.municipality || "-"}</td>
            </tr>`;
        } else if (tipo === "merchants") {
          return `<tr>
              <td>${u.user_id}</td>
              <td>${u.merchant_name}</td>
              <td>${u.description}</td>
              <td><img src="${u.logo_url}" alt="logo"></td>
              <td>${u.merchant_type}</td>
            </tr>`;
        } else if (tipo === "admins") {
          return `<tr>
              <td>${u.user_id}</td>
              <td>${u.full_name}</td>
              <td>${u.is_super_admin}</td>
            </tr>`;
        }
      }).join("");
    }

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
        document.querySelectorAll("tbody tr").forEach(tr => {
          tr.classList.add("destacado");
        });
      } else {
        renderTabla(usuariosActuales, tipo);
      }
    });

    filtroSelect.addEventListener("change", (e) => {
      cargarUsuarios(e.target.value);
    });

    cargarUsuarios();


// === MODAL Y BOTÓN AGREGAR COMERCIO ===
const modalComercio = document.getElementById("modalComercio");
const abrirModalComercio = document.getElementById("abrirModalComercio");
const cerrarModalComercio = document.getElementById("cerrarModalComercio");
const formComercio = document.getElementById("formComercio");
const botonComercioContainer = document.getElementById("botonComercioContainer");

//Mostrar el botón solo si el filtro actual es "merchants"
filtroSelect.addEventListener("change", (e) => {
  const tipo = e.target.value;
  if (tipo === "merchants") {
    botonComercioContainer.style.display = "block";
  } else {
    botonComercioContainer.style.display = "none";
  }
  cargarUsuarios(tipo);
});

// Abrir modal
abrirModalComercio.addEventListener("click", () => {
  modalComercio.classList.add("show");
});

//Cerrar modal
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

// Enviar datos al endpoint
formComercio.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    user_id: parseInt(document.getElementById("user_id").value),
    merchant_name: document.getElementById("merchant_name").value.trim(),
    description: document.getElementById("description").value.trim(),
    logo_url: document.getElementById("logo_url").value.trim(),
    merchant_type: document.getElementById("merchant_type").value.trim()
  };

  try {
    const response = await fetch("https://bj-api.site/beneficioJoven/merchants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([data]) // el endpoint espera arreglo con un objeto
    });

    if (!response.ok) throw new Error("Error al agregar comercio");
    alert("Comercio agregado exitosamente.");
    modalComercio.classList.remove("show");
    formComercio.reset();
    cargarUsuarios("merchants");
  } catch (err) {
    console.error(err);
    alert("No se pudo agregar el comercio: " + err.message);
  }
});
