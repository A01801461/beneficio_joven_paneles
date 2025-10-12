
# 📱 Beneficio Joven – Repo 2: Paneles de Administradores y Comercios

Este repositorio contiene el desarrollo de la **aplicación web de administración** del programa **Beneficio Joven**, una iniciativa del **Gobierno Municipal de Atizapán de Zaragoza** para apoyar a la juventud del municipio mediante **cupones, promociones y descuentos exclusivos** en comercios aliados.

El proyecto busca impulsar la participación juvenil y facilitar el acceso a beneficios que promuevan el bienestar, la economía local y las oportunidades para los jóvenes de Atizapán.

---

## 🌟 Componentes principales del proyecto completo 

1. **Aplicación móvil (Kotlin – Android)**

   - Codigo: https://github.com/PeritiaCodex/BeneficioJoven
   - Registro e inicio de sesión de los jóvenes beneficiarios.
   - Consulta de cupones y promociones disponibles.
   - Canje digital mediante código QR o clave única.
   - Perfil personal con historial de cupones utilizados.

2. **Panel de administración (HTML, CSS, JS)**

   - Codigo: https://github.com/A01801461/beneficio_joven_paneles
   - Gestión de usuarios (jóvenes registrados).
   - Registro y administración de comercios participantes.
   - Creación, edición y seguimiento de cupones/promociones.
   - Reportes y estadísticas de uso para el municipio.
  
3. **Servidor Backend (API + lógica de negocio)**

   - Codigo: https://github.com/A01801461/beneficio_joven_backend
   - Alojado en https://bj-api.site
   - Se encarga de la autenticación de usuarios y roles.
   - Administra el ciclo de vida de los cupones (creación, validación, redención).
   - Expone un API REST para que lo consuman la aplicación móvil y los paneles web.

---

## ⚙️ Detalles del Panel de Administradores

Una aplicación web **construida con HTML, CSS y JavaScript utilizando Express.** Está diseñada para que los administradores suban y gestionen cupones, administren las cuentas de los comercios y obtengan información sobre los usuarios. Se conecta directamente con la API alojada en https://bj-api.site o en https://github.com/A01801461/beneficio_joven_backend, y utiliza sus endpoints para ofrecer una interfaz de usuario cómoda y amigable que permite administrar la información en la base de datos. Aún falta implementar la autenticación y seguridad.

### **Cómo probar el panel localmente **

1. **Requisitos**:
   - Instala **Node.js** (v18+).

2. **Configuración**:
   - Clona este repositorio.
   - Instala dependencias: `npm install express`.
   - Corre la aplicacion web: `node app.js`.

3. **Pruebas**:
   - Navega y explora los datos de nuestra base de datos.

---

## 📄 Licencia

Este proyecto es propiedad del **Gobierno Municipal de Atizapán de Zaragoza**.
Su uso está limitado a fines institucionales y no puede ser distribuido ni comercializado sin autorización expresa.
