import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendSmsCode(phone, code) {
  if (!client) {
    console.log('[smsService] Twilio not configured — simulando envío. Código:', code);
    return { sid: 'simulated' };
  }
  return client.messages.create({
    body: `Tu código de acceso es: ${code}`,
    from: fromNumber,
    to: phone
  });
}
