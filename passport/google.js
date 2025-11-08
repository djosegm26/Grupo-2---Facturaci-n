import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Usuario from "../models/Usuario.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Obtener el correo del perfil de Google
        const email = profile.emails[0].value;

        // Buscar usuario por el campo 'email'
        let usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
          // Si no existe, lo creamos
          usuario = await Usuario.create({
            nombre: profile.displayName,
            email,
            googleId: profile.id,
            rol: "cliente", // puedes ajustarlo si tu modelo usa otro valor por defecto
            estado: true,   // para evitar problemas si el modelo requiere este campo
          });
          console.log("🆕 Nuevo usuario registrado con Google:", usuario.email);
        } else {
          console.log("✅ Usuario existente con Google:", usuario.email);
        }

        return done(null, usuario);
      } catch (err) {
        console.error("❌ Error al autenticar usuario con Google:", err);
        return done(err, null);
      }
    }
  )
);

// Serializar usuario (guarda el ID en la sesión)
passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

// Deserializar usuario (recupera el usuario desde la BD por su ID)
passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario);
  } catch (err) {
    done(err, null);
  }
});

export default passport;


