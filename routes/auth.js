import express from "express";
import passport from "../passport/google.js";

const router = express.Router();

/**
 * Iniciar sesión con Google
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * Callback de Google
 * - Si la autenticación es exitosa → redirige al panel principal (/index)
 * - Si falla → regresa al login (/)
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/", // vuelve al login si algo sale mal
  }),
  (req, res) => {
    console.log("✅ Usuario autenticado:", req.user?.email);
    res.redirect("/index"); // redirige al inicio principal
  }
);

/**
 * -Logout (cerrar sesión)
 * - Destruye la sesión de Passport
 * - Redirige al login (/)
 */
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      console.error("❌ Error al cerrar sesión:", err);
    }
    req.session.destroy(() => {
      res.redirect("/"); // vuelve al login
    });
  });
});

export default router;


