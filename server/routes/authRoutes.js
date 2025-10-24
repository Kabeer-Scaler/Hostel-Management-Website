const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require("../controllers/authController.js");

router.post("/signup", registerUser);
router.post("/login", loginUser);

// 1. The route to initiate Google login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // What we ask Google for
    session: false, // We are using JWTs, not sessions
  })
);

// 2. The callback route Google redirects to
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login', // Redirect to frontend login on fail
    session: false,
  }),
  (req, res) => {
    // --- THIS IS THE JWT PART ---
    // `req.user` is the user object from our Passport verify callback
    
    // 1. Create a JWT
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 2. Redirect back to the *frontend* and pass the token in the URL
    // We'll create a special frontend route to handle this.
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

module.exports = router;
