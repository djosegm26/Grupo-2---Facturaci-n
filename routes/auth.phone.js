import express from 'express';
import User from '../models/User.js';
import { sendSmsCode } from '../services/smsService.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/phone/request-code', async (req, res) => {
  try {
    const phone = req.body.phone;
    if (!phone) return res.status(400).json({ error: 'phone required' });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10*60*1000);
    let user = await User.findOne({ where: { phone }});
    if (!user) user = await User.create({ phone, phoneVerified: false });
    user.phoneCode = code;
    user.phoneCodeExpires = expires;
    await user.save();
    await sendSmsCode(phone, code);
    return res.json({ ok: true, message: 'Código enviado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

router.post('/phone/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'phone and code required' });
    const user = await User.findOne({ where: { phone }});
    if (!user) return res.status(404).json({ error: 'No user' });
    if (!user.phoneCode || !user.phoneCodeExpires) return res.status(400).json({ error: 'No code requested' });
    if (new Date() > user.phoneCodeExpires) return res.status(400).json({ error: 'Code expired' });
    if (user.phoneCode !== code) return res.status(400).json({ error: 'Invalid code' });
    user.phoneVerified = true;
    user.phoneCode = null;
    user.phoneCodeExpires = null;
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });
    // set token as httpOnly cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    return res.json({ ok: true, token, user: { id: user.id, phone: user.phone } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

export default router;
