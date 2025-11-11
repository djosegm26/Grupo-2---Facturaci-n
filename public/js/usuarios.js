document.addEventListener('DOMContentLoaded', () => {
  const phoneForm = document.getElementById('phone-form');
  const codeForm = document.getElementById('code-form');
  if (phoneForm) {
    phoneForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('phone').value;
      const res = await fetch('/auth/phone/request-code', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ phone })
      });
      const j = await res.json();
      alert(j.message || j.error);
      if (j.ok) {
        document.getElementById('code-section').style.display = 'block';
      }
    });
  }
  if (codeForm) {
    codeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('phone').value;
      const code = document.getElementById('code').value;
      const res = await fetch('/auth/phone/verify-code', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ phone, code })
      });
      const j = await res.json();
      if (j.ok && j.token) {
        alert('Inicio de sesión correcto');
        localStorage.setItem('token', j.token);
        window.location.href = '/';
      } else {
        alert(j.error || 'Error en verificación');
      }
    });
  }
});

