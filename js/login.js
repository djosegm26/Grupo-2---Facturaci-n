// login.js - maneja mostrar contraseña y recordarme con localStorage
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");
    const showPasswordCheckbox = document.getElementById("showPassword");
    const errorMsg = document.getElementById("errorMsg");

    const STORAGE_KEY = "facturacion_remembered_user";

  // Inicializar: si hay usuario guardado, rellenar y marcar el checkbox
    const rememberedUser = localStorage.getItem(STORAGE_KEY);
    if (rememberedUser) {
    usernameInput.value = rememberedUser;
    rememberCheckbox.checked = true;
    passwordInput.focus();
    } else {
    usernameInput.focus();
    }

  // Toggle mostrar/ocultar contraseña
    showPasswordCheckbox.addEventListener("change", function () {
    passwordInput.type = this.checked ? "text" : "password";
    });

  // Si cambian el checkbox de recordar: guardar o eliminar
    rememberCheckbox.addEventListener("change", function () {
    const user = usernameInput.value.trim();
    if (this.checked) {
        if (user) localStorage.setItem(STORAGE_KEY, user);
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
    });

  // Si el usuario escribe y el checkbox 'remember' está activo, actualizar el valor en storage
    usernameInput.addEventListener("input", function () {
    if (rememberCheckbox.checked) {
        const u = this.value.trim();
        if (u) localStorage.setItem(STORAGE_KEY, u);
        else localStorage.removeItem(STORAGE_KEY);
    }
    // limpiar error visual
    if (errorMsg.textContent) errorMsg.textContent = "";
    });

  // Manejo del submit (login real o simulado)
    loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;

    // Simple validación de ejemplo (cambia a tu auth real después)
    if (user === "admin" && pass === "1234") {
      // almacenar si pidió recordar
        if (rememberCheckbox.checked && user) {
        localStorage.setItem(STORAGE_KEY, user);
        } else {
        localStorage.removeItem(STORAGE_KEY);
        }

      // redirigir al dashboard
        window.location.href = "inicio.html";
    } else {
        errorMsg.textContent = "Usuario o contraseña incorrectos";
        passwordInput.value = "";
        passwordInput.focus();
    }
    });
});

