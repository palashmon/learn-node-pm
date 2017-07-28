// This file is used to handle passportJS strategy after login
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());

// In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request.
// If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
// Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
// In order to support login sessions, Passport will serialize and deserialize 'user' instances to and from the session.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
