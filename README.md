# Passport-mock
Designed as a drop in replacement for any passport auth strategy for integration tests.

#### Use

```javascript
var express = require('express');
var app = express();
var Strategy;

if (process.env.NODE_ENV == 'test' ) {
  Strategy = requrie('passport-mock').Strategy;
} else {
  Strategy = require('passport-facebook').Strategy;
}

passport.use(new Strategy({
    name: 'facebook',
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  });
);
```