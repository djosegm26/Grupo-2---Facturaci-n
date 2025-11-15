import axios from "axios";

// URL base del entorno Factus (por defecto sandbox)
const FACTUS_URL = process.env.FACTUS_URL || "https://api-sandbox.factus.com.co";

// Credenciales necesarias para autenticación OAuth2
const EMAIL = process.env.FACTUS_EMAIL;
const PASSWORD = process.env.FACTUS_PASSWORD;
const CLIENT_ID = process.env.FACTUS_CLIENT_ID;
const CLIENT_SECRET = process.env.FACTUS_CLIENT_SECRET;


// ======================================================
// 1) Obtener access_token desde Factus vía OAuth2 (grant_type: password)
//    Este token es necesario para consumir los endpoints protegidos.
// ======================================================
async function getAccessToken() {
  try {
    // Solicitud POST al endpoint de autenticación
    const resp = await axios.post(`${FACTUS_URL}/oauth/token`, {
      grant_type: "password", // tipo de autenticación
      username: EMAIL,
      password: PASSWORD,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });

    // Retorna únicamente el access_token
    return resp.data.access_token;

  } catch (err) {
    console.error("Error obteniendo token Factus:", err.response?.data || err.message);
    throw err; // re-lanza error para que la función llamante lo maneje
  }
}


// ======================================================
// 2) Crear y validar una factura en Factus
//    Endpoint correcto: /v1/bills/validate
//    Se debe enviar el token obtenido en la cabecera Authorization.
// ======================================================
async function crearFacturaEnFactus(payload) {
  // obtiene token automáticamente
  const token = await getAccessToken();

  // Envía la factura al endpoint de validación
  const resp = await axios.post(
    `${FACTUS_URL}/v1/bills/validate`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}` // token requerido por Factus
      }
    }
  );

  // retorna la respuesta completa del servicio
  return resp.data;
}


// Exportación de funciones para uso en otras rutas o servicios
export { getAccessToken, crearFacturaEnFactus };



