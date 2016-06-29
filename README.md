# Passport-strategy-mock
Designed as a drop in replacement for any passport auth strategy for integration tests.

#### How to use in your code

```javascript
var express = require('express');
var app = express();
var Strategy;

if (process.env.NODE_ENV == 'test' ) {
  Strategy = require('passport-strategy-mock').Strategy;
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

#### How to use in your test

```javascript
// app is loaded and running in the same process
// using the testing framework of your choice
// probably something like selenium, since you'll most likely need a browser

var passport = require('passport');

this.When(^/I log in to facebook as:$/, function (table, next) {
  passport._strategies.facebook._profile = {
    displayName: 'Jon Smith',
    id: 1234,
    emails: [ { value: 'jon.smith@example.com' } ]
  };
  browser.get('/auth/facebook', next);
});

this.Then(^/I should see Jon Smith on the page:$/, function (next) {
  driver.findElement(webdriver.By.css("body")).catch(next).then(function(element){
    element.getText().catch(next).then(function(text){
      console.assert(!!~text.indexOf("Jon Smith"), text + ' should have contained "Jon Smith"');
      next();
    });
  });
});

```
