Cambios añadidos por el asistente (Google Sign-In + SMS) - Integrado en el proyecto

Archivos añadidos/modificados:
- models/User.js  (nuevo modelo de usuario con campos para googleId y teléfono)
- services/smsService.js  (servicio Twilio)
- routes/auth.phone.js  (endpoints para request-code y verify-code)
- routes/auth.google.js  (endpoints para Google OAuth)
- routes/users.js  (ruta /users que renderiza la vista)
- views/users.ejs  (vista EJS que lista usuarios y provee formulario SMS)
- public/js/usuarios.js  (JS cliente para flujo SMS)
- passport/googleStrategy.js (configuración Passport + GoogleStrategy)
- package.json updated: added dependencies (passport, passport-google-oauth20, twilio, jsonwebtoken, cookie-parser)

Cómo probar (resumen):
1. Instala dependencias: dentro de la carpeta del proyecto ejecuta `npm install`.
2. Copia `.env.example` a `.env` y completa las credenciales:
   - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
   - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
   - JWT_SECRET
3. Ejecuta el servidor: `npm run dev` o `npm start`.
4. Visita `http://localhost:3000/users` para ver la tabla de usuarios y el formulario SMS.
5. Para probar Google: visita `http://localhost:3000/auth/google` (te redirigirá a Google y luego volverá al callback).

Notas de seguridad y observaciones:
- El endpoint `/auth/phone/verify-code` genera un JWT y lo guarda en una cookie httpOnly llamada `token`.
- Si no configuras Twilio, el envío de SMS se simula y el código aparece en la consola del servidor.
- Asegúrate de que la tabla `users` exista en la base de datos. Puedes habilitar `sequelize.sync({ alter: true })` temporalmente en server.js para crearla automáticamente.
- Revisa y adapta los nombres de tablas/columnas si quieres seguir una convención diferente.
