const passport = require('passport');
const port = 3445;

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

const providers = [ 'dropbox', 'google', 'box' ];

const configs = providers.map(function(provider) {
  return {
    name: provider,
    callbackURL: 'http://localhost:' + port + '/auth/' + provider + '/callback'
  };
});

// passport-mock
const Strategy = require('../../').Strategy;

configs.forEach(function(config) {
  passport.use(new Strategy(config, function (accessToken, refreshToken, profile, done) {
    debugger
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    done(null, profile);
  }));
});

const express = require('express')
    , app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(require('morgan')('dev'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals = { profile: req.user || {}, providers: providers };
  next();
});

let count = 0;
const mockMiddlware = (provider) => {
  return (req, res, next) => {
    const strategy = passport._strategies[provider];

    strategy._addVerifyArgs(
      `at-${provider}`,
      `rt-${provider}`,
      { id: ++count, provider: provider }
    );

    next();
  };
};

providers.forEach(function (provider) {
  app.get('/auth/' + provider, mockMiddlware(provider), passport.authenticate(provider));
  app.get('/auth/' + provider + '/callback', passport.authenticate(provider, { successRedirect: '/', failureRedirect: '/' }));
});

app.get('/logout', function (req, res, next) {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/', function (req, res, next) { res.render('index'); });

const server = app.listen(port, function () {
  console.log('Passport Mock Example listening at http://localhost:%s', port);
});
