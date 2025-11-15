import passport from "passport";                                   // Middleware de autenticación
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Estrategia de OAuth2 con Google
import Usuario from "../models/Usuario.js";                        // Modelo de usuario para consultar/crear registros


// ===============================
//   CONFIGURACIÓN DE GOOGLE OAUTH
// ===============================
passport.use(
  new GoogleStrategy(
    {
      // Credenciales del proyecto de Google Cloud
      clientID: process.env.GOOGLE_CLIENT_ID,        // ID de cliente de Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,// Secret asociado al cliente
      callbackURL: process.env.GOOGLE_CALLBACK_URL,  // URL a la que Google redirige tras autenticarse
    },

    // Función ejecutada después de que Google valida al usuario
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extraer el correo principal del usuario de Google
        const email = profile.emails[0].value;

        // Buscar si el usuario ya existe en la base de datos
        let usuario = await Usuario.findOne({ where: { email } });

        // Si no existe, crearlo en la BD
        if (!usuario) {
          usuario = await Usuario.create({
            nombre: profile.displayName,  // Nombre mostrado en Google
            email,                        // Correo extraído del perfil
            googleId: profile.id,         // ID único de Google
            rol: "cliente",               // Rol por defecto (puedes adaptarlo)
            estado: true,                 // Marca el usuario como activo
          });

          console.log("🆕 Nuevo usuario registrado con Google:", usuario.email);
        } else {
          console.log("✅ Usuario existente con Google:", usuario.email);
        }

        // Finaliza la autenticación y pasa el usuario a Passport
        return done(null, usuario);
      } catch (err) {
        console.error("❌ Error al autenticar usuario con Google:", err);
        return done(err, null);
      }
    }
  )
);


// ===============================
//   MANEJO DE SESIONES CON PASSPORT
// ===============================

// Serializa: guarda solo el ID del usuario en la sesión
passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

// Deserializa: busca el usuario completo usando el ID almacenado
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario);
  } catch (err) {
    done(err, null);
  }
});


export default passport;  // Exportamos la configuración final de passport



