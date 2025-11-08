import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

// iniciar OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  // req.user proviene de passport
  const user = req.user;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });
  // set cookie httpOnly
  res.cookie('token', token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  // redirigir a frontend - aquí redirigimos a /index
  res.redirect('/index');
});

export default router;
