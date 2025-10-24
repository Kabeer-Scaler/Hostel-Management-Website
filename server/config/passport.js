const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/user.model.js');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        // 1. Get credentials from your .env file
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // This MUST match the route in authRoutes.js and your Google Console setup
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // This is the "verify" callback. It runs after Google authenticates the user.

        // 2. We get the user's info from Google
        const googleUser = {
          name: profile.displayName,
          email: profile.emails[0].value.toLowerCase().trim(), // Normalize email
          // googleId: profile.id // You could add this field to your user.model.js
        };

        try {
          // 3. Check if this user already exists in your database
          let user = await User.findOne({ email: googleUser.email });

          if (user) {
            // --- USER ALREADY EXISTS ---
            // The user exists (e.g., they signed up manually before).
            // We just pass them along to the route handler.
            return done(null, user);
          } else {
            // --- NEW USER: CREATE THEM ---
            // This is their first time logging in.
            // Your user.model.js requires a password, so we must create one.

            // 1. Generate a secure, random password that will never be used.
            const randomPassword =
              Math.random().toString(36).slice(-8) + 'A1!';

            // 2. Hash the random password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            // 3. Create the new user in the database
            user = await User.create({
              name: googleUser.name,
              email: googleUser.email,
              password: hashedPassword, // Store the HASHED password
              // 'role' will automatically default to 'student'
            });

            // 4. Pass the new user to the route handler
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  // These are required by Passport for session management.
  // In our JWT (stateless) setup, they aren't strictly used for user
  // sessions, but they are needed for Passport's internal workings.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};