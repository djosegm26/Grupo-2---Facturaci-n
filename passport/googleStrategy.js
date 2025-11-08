import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/Usuario.js'; 
import Usuario from '../models/Usuario.js';

export default function configurePassport() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      let user = null;
      if (googleId) user = await User.findOne({ where: { googleId }});
      if (!user && email) user = await User.findOne({ where: { email }});
      if (user) {
        if (!user.googleId) { user.googleId = googleId; await user.save(); }
        return done(null, user);
      }
      const newUser = await Usuario.create({
        googleId,
        email,
        name: profile.displayName
      });
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }));
}
