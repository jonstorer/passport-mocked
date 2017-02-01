var passport = require('passport');
var port = 3445;

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

var providers = [ 'dropbox', 'google', 'box' ];

var configs = providers.map(function(provider) {
  return {
    name: provider,
    callbackURL: 'http://localhost:' + port + '/auth/' + provider + '/callback'
  };
});

// passport-mock
var Strategy = require('../../').Strategy;

configs.forEach(function(config) {
  passport.use(new Strategy(config, function (accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    done(null, profile);
  }));
});

var express = require('express')
  , app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('express-session')({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals = { profile: req.user || {}, providers: providers };
  next();
});

app.use(express.static(__dirname + '/public'));

var count = 0;
var buildFakeProfile = function (provider) {
  return function (req, res, next) {
    var strategy = passport._strategies[provider];
    strategy._token_response = { access_token: provider + '-at', expires_in: 3600 };
    strategy._profile = { id: ++count, provider: provider };
    next();
  };
};

providers.forEach(function (provider) {
  app.get('/auth/' + provider, buildFakeProfile(provider), passport.authenticate(provider));
  app.get('/auth/' + provider + '/callback', passport.authenticate(provider, { successRedirect: '/', failureRedirect: '/' }));
});

app.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/', function (req, res, next) { res.render('index'); });

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Passport Mock Example listening at http://%s:%s', host, port);
});
