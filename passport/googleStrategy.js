import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Import del modelo Usuario (estaba duplicado como User y Usuario)
import Usuario from '../models/Usuario.js';

/**
 * Configura la estrategia de autenticación con Google para Passport.
 * Esta función debe ejecutarse en el arranque del servidor.
 */
export default function configurePassport() {

  passport.use(
    new GoogleStrategy(
      {
        // Credenciales obtenidas desde Google Cloud Console
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

        // URL a la que Google redirige después de autenticarse
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          'http://localhost:3000/auth/google/callback',
      },

      /**
       * Función principal que maneja el login con Google.
       * Se ejecuta automáticamente después de que Google valide al usuario.
       */
      async (accessToken, refreshToken, profile, done) => {
        try {
          // ID único que Google asigna al usuario
          const googleId = profile.id;

          // Extraemos el email si existe en el perfil
          const email =
            profile.emails &&
            profile.emails[0] &&
            profile.emails[0].value;

          let user = null;

          // Buscar usuario por googleId si ya se registró antes
          if (googleId) {
            user = await Usuario.findOne({ where: { googleId } });
          }

          // Si no existe por googleId, buscar por email
          if (!user && email) {
            user = await Usuario.findOne({ where: { email } });
          }

          // Si el usuario ya existe, actualizar googleId si hace falta
          if (user) {
            if (!user.googleId) {
              user.googleId = googleId;
              await user.save(); // Guardamos la relación con Google
            }

            return done(null, user); // Login exitoso
          }

          // Si el usuario NO existe, crearlo
          const newUser = await Usuario.create({
            googleId,
            email,
            name: profile.displayName, // Nombre visible de la cuenta de Google
          });

          return done(null, newUser); // Registro + login
        } catch (err) {
          return done(err); // Manejo de errores
        }
      }
    )
  );
}
