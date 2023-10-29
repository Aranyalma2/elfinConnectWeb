const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));

// Passport Configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await database.User.findOne({ name: username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await database.User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/devices',
  failureRedirect: '/',
  failureFlash: false, // Enable this for flash messages (optional).
}));

app.get('/devices', (req, res) => {
  const user = req.user;

  if (user) {
    database.Device.find({ _id: { $in: user.deviceCollection } })
      .exec()
      .then(devices => {
        res.render('devices', { user, devices });
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    res.redirect('/');
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the username is already taken
    const existingUser = await database.User.findOne({ name: username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Create a new user and save it to the database using Promises
    const newUser = new database.User({ name: username, password: hashedPassword });
    await newUser.save();

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Registration failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
