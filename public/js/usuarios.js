// ===================================================
//  Esperar a que el DOM cargue completamente
// ===================================================
document.addEventListener('DOMContentLoaded', () => {

  // Formularios del flujo de autenticación por teléfono
  const phoneForm = document.getElementById('phone-form');
  const codeForm = document.getElementById('code-form');


  // ===================================================
  // 1. Solicitar código de verificación por teléfono
  // ===================================================
  if (phoneForm) {
    phoneForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita recargar la página

      // Obtener el número ingresado por el usuario
      const phone = document.getElementById('phone').value;

      // Enviar solicitud al backend para generar y enviar el código
      const res = await fetch('/auth/phone/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const j = await res.json();

      // Mostrar mensaje del servidor (éxito o error)
      alert(j.message || j.error);

      // Si todo salió bien, mostrar el formulario para ingresar el código
      if (j.ok) {
        document.getElementById('code-section').style.display = 'block';
      }
    });
  }



  // ===================================================
  // 2. Verificar código de autenticación
  // ===================================================
  if (codeForm) {
    codeForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita recargar la página

      const phone = document.getElementById('phone').value;
      const code = document.getElementById('code').value;

      // Enviar código al backend para validación
      const res = await fetch('/auth/phone/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });

      const j = await res.json();

      // Si todo es correcto y recibimos un token → iniciar sesión
      if (j.ok && j.token) {
        alert('Inicio de sesión correcto');

        // Guardar token en localStorage para mantener la sesión
        localStorage.setItem('token', j.token);

        // Redirigir al usuario a la página principal
        window.location.href = '/';
      } else {
        // Error al verificar código
        alert(j.error || 'Error en verificación');
      }
    });
  }

});

