var Strategy = require('../../').Strategy
  , Factory = require('../../lib/passport-mock/factory')
  , expect = require('chai').expect
  , sinon = require('sinon')
  , passport = require('passport');

it('inherits from passport', function () {
  expect(Strategy.super_).to.eql(passport.Strategy);
});

describe('init', function () {
  describe('name', function () {
    it('has a default', function () {
      var strategy = Object.create(new Strategy({ callbackURL: '/cb' }, function(){}));
      expect(strategy.name).to.eql('mock')
    });

    it('can be set', function () {
      var strategy = Object.create(new Strategy({ name: 'test', callbackURL: '/cb' }, function(){}));
      expect(strategy.name).to.eql('test')
    });
  });

  describe('verify', function () {
    it('requires a verifiy function be passed in', function () {
      expect(function() {
        new Strategy({ callbackURL: '/cb' });
      }).to.throw(Error);
    });
  });

  describe('callbackUrl', function () {
    it('requires a callbackUrl', function () {
      expect(function (){
        new Strategy({}, function () {});
      }).to.throw(TypeError);
    });

    it('can set the callbackURL', function () {
      var strategy = Object.create(new Strategy({ callbackURL: '/here' }, function () {}));
      expect(strategy._callbackURL).to.eql('/here');
    });
  });

  describe('#_factories', function () {
    var strategy;

    beforeEach(function(){
      strategy = Object.create(new Strategy({ callbackURL: '/' }, function () {}));
    });

    it('has factories', function () {
      expect(strategy._factory).to.be.an.instanceOf(Factory);
    });

    it('has a Dropbox Factory', function () {
      expect(strategy._factory.build('Dropbox')).to.exist
      expect(strategy._factory.build('dropbox')).to.exist
    })

    it('has a Google Factory', function () {
      expect(strategy._factory.build('Google')).to.exist
      expect(strategy._factory.build('google')).to.exist
    });

    it('has a Box Factory', function () {
      expect(strategy._factory.build('Box')).to.exist
      expect(strategy._factory.build('box')).to.exist
    });
  });
});

describe('#authenticate', function(){
  var strategy, req;

  beforeEach(function (){
    req = { query: { } };
  });

  context('first call', function () {
    beforeEach(function(){
      strategy = Object.create(new Strategy({ callbackURL: '/cb' }, function() { }));
    });

    it('redirects the user to the callbackURL with the correct query param', function () {
      strategy.redirect = function(path) {
        expect(path).to.eql('/cb?__mock_strategy_callback=true');
      };
      strategy.authenticate(req, {});
    });
  });

  context('second call', function () {
    context('failure', function () {
      describe('#_error', function () {
        beforeEach(function(){
          strategy = new Strategy({ callbackURL: '/cb' }, function (at, rt, p, cb) { cb(); });
          strategy._error = new Error('test error');
          strategy = Object.create(strategy);
          strategy.redirect = function () {};
          strategy.authenticate(req, {});
        });

        it('calls the fail method', function (done) {
          strategy.fail = function(err, statusCode) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.eql('test error');
            expect(statusCode).to.eql(401);
            expect(strategy._error).to.not.exist;
            done();
          };
          req.query.__mock_strategy_callback = true;
          strategy.authenticate(req, {});
        });
      });
    });

    context('success', function () {
      var accessToken, refreshToken, profile;

      var decorateStrategy = function (strategy) {
        strategy = Object.create(strategy);
        strategy._accessToken = 'at';
        strategy._refreshToken = 'rt';
        strategy._expires_in = 98765;
        strategy._scope = 'email';
        strategy._token_type = 'access_token';
        strategy._profile = { count: 1 };
        return strategy;
      };

      beforeEach(function () {
        req.query.__mock_strategy_callback = true;
      });

      context('verify', function() {
        context('passReqToCallback:false', function () {
          it('handles a verify method that asks for accessToken, refreshToken, and profile', function (done) {
            strategy = new Strategy({ callbackURL: '/cb' }, function (at, rt, pr, cb) {
              cb(null, { profile: pr, accessToken: at, refreshToken: rt });
            });

            strategy = decorateStrategy(strategy);

            strategy.success = function (body) {
              expect(body.accessToken).to.eql('at');
              expect(body.refreshToken).to.eql('rt');
              expect(body.profile.count).to.eql(1);
              done();
            };
            strategy.authenticate(req, {});
          });

          it('handles a verify method that asks for accessToken, refreshToken, token response, and profile', function (done) {
            strategy = new Strategy({ callbackURL: '/cb' }, function (at, rt, pa, pr, cb) {
              cb(null, { profile: pr, params: pa, accessToken: at, refreshToken: rt });
            });
            strategy = decorateStrategy(strategy);

            strategy.success = function (body) {
              expect(body.accessToken).to.eql('at');
              expect(body.refreshToken).to.eql('rt');
              expect(body.profile.count).to.eql(1);
              expect(body.params).to.have.keys('access_token', 'expires_in', 'token_type', 'scope')
              expect(body.params.access_token).to.eql('at');
              expect(body.params.expires_in).to.eql(98765);
              expect(body.params.scope).to.eql('email');
              expect(body.params.token_type).to.eql('access_token');
              done();
            };
            strategy.authenticate(req, {});
          });
        });

        context('passReqToCallback:true', function () {
          it('handles a verify method that asks for req, accessToken, refreshToken, and profile', function (done) {
            strategy = new Strategy({ callbackURL: '/cb', passReqToCallback: true }, function (req, at, rt, pr, cb) {
              cb(null, { req: req, profile: pr, accessToken: at, refreshToken: rt });
            });

            strategy = decorateStrategy(strategy);

            strategy.success = function (body) {
              expect(body.accessToken).to.eql('at');
              expect(body.refreshToken).to.eql('rt');
              expect(body.profile.count).to.eql(1);
              expect(body.req).to.eql(req);
              done();
            };
            strategy.authenticate(req, {});
          });

          it('handles a verify method that asks for req, accessToken, refreshToken, token response, and profile', function (done) {
            strategy = new Strategy({ callbackURL: '/cb' }, function (req, at, rt, pa, pr, cb) {
              cb(null, { profile: pr, params: pa, accessToken: at, refreshToken: rt });
            });
            strategy = decorateStrategy(strategy);

            strategy.success = function (body) {
              expect(body.accessToken).to.eql('at');
              expect(body.refreshToken).to.eql('rt');
              expect(body.profile.count).to.eql(1);
              expect(body.params).to.have.keys('access_token', 'expires_in', 'token_type', 'scope')
              expect(body.params.access_token).to.eql('at');
              expect(body.params.expires_in).to.eql(98765);
              expect(body.params.scope).to.eql('email');
              expect(body.params.token_type).to.eql('access_token');
              done();
            };
            strategy.authenticate(req, {});
          });
        });
      });

      context('standard', function () {
        beforeEach(function(){
          strategy = new Strategy({ callbackURL: '/cb' }, function (at, rt, p, cb) {
            profile = p || {};
            profile.accessToken = at;
            profile.refreshToken = rt;
            cb(null, profile);
          });
          req.query.__mock_strategy_callback = true;
        });

        describe('#_accessToken', function () {
          it('creates an access token on the fly', function (done) {
            strategy = Object.create(strategy);
            expect(strategy._accessToken).to.not.exist;
            strategy.success = function (profile) {
              expect(strategy._accessToken).to.not.exist;
              expect(profile.accessToken).to.have.length(40);
              done();
            };
            strategy.authenticate(req, {});
          });

          it('will use the provided accessToken', function (done) {
            strategy._accessToken = 'my token';
            strategy = Object.create(strategy);
            strategy.success = function (profile) {
              expect(strategy._accessToken).to.not.exist;
              expect(profile.accessToken).to.eql('my token');
              done();
            };
            strategy.authenticate(req, {});
          });
        });

        describe('#_refreshToken', function () {
          it('creates a refresh token on the fly', function (done) {
            strategy = Object.create(strategy);
            expect(strategy._refreshToken).to.not.exist;
            strategy.success = function (profile) {
              expect(strategy._refreshToken).to.not.exist;
              expect(profile.refreshToken).to.have.length(40);
              done();
            };
            strategy.authenticate(req, {});
          });

          it('will use the provided refreshToken', function (done) {
            strategy._refreshToken = 'my token';
            strategy = Object.create(strategy);
            strategy.success = function (profile) {
              expect(strategy._refreshToken).to.not.exist;
              expect(profile.refreshToken).to.eql('my token');
              done();
            };
            strategy.authenticate(req, {});
          });
        });

        describe('#_profile', function () {
          it('handles the profile correctly', function (done) {
            var tmpProfile = strategy._factory.build('Dropbox', { email: 'test@example.com', id: '1234 ' });
            strategy._profile = tmpProfile;
            strategy = Object.create(strategy);
            strategy.success = function (profile) {
              expect(strategy._profile).to.not.exist;
              delete profile.accessToken;
              delete profile.refreshToken;
              expect(profile).to.eql(tmpProfile);
              done();
            };
            strategy.authenticate(req, {});
          });

          it('will create a profile based on the name if one was not provided', function (done) {
            strategy._factory.add('for-tests', function () { return 'hey!' });
            strategy.name = 'for-tests';
            strategy = Object.create(strategy);
            strategy.success = function(profile) {
              expect(profile).to.eql('hey!');
              done();
            };
            strategy.authenticate(req, {});
          });
        });
      });
    });
  });
});
