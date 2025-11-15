import axios from "axios";

const FACTUS_URL = process.env.FACTUS_URL || "https://api-sandbox.factus.com.co";
const EMAIL = process.env.FACTUS_EMAIL;
const PASSWORD = process.env.FACTUS_PASSWORD;
const CLIENT_ID = process.env.FACTUS_CLIENT_ID;
const CLIENT_SECRET = process.env.FACTUS_CLIENT_SECRET;

// 1) Obtener access_token via OAuth2
async function getAccessToken() {
  try {
    const resp = await axios.post(`${FACTUS_URL}/oauth/token`, {
      grant_type: "password",
      username: EMAIL,
      password: PASSWORD,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });

    return resp.data.access_token;

  } catch (err) {
    console.error("Error obteniendo token Factus:", err.response?.data || err.message);
    throw err;
  }
}

// 2) Crear y validar factura en Factus (endpoint correcto)
async function crearFacturaEnFactus(payload) {
  const token = await getAccessToken();

  const resp = await axios.post(
    `${FACTUS_URL}/v1/bills/validate`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return resp.data;
}

export { getAccessToken, crearFacturaEnFactus };


