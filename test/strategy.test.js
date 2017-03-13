var Strategy = require('../').Strategy
  , expect = require('chai').expect
  , passport = require('passport');

it('inherits from passport', function () {
  expect(Strategy.super_).to.eql(passport.Strategy);
});

describe('init', function () {
  describe('name', function () {
    it('has a default', function () {
      var strategy = Object.create(new Strategy({ callbackURL: '/cb' }, function () {}));
      expect(strategy.name).to.eql('mocked')
    });

    it('can be set', function () {
      var strategy = Object.create(new Strategy({ name: 'test', callbackURL: '/cb' }, function () {}));
      expect(strategy.name).to.eql('test')
    });
  });

  describe('verify', function () {
    it('requires a verifiy function be passed in', function () {
      expect(function () {
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

    it('can be set for OAuth 2', function () {
      var strategy = Object.create(new Strategy({ callbackURL: '/here' }, function () {}));
      expect(strategy._callbackURL).to.eql('/here');
    });

    it('can be set for OpenID Connect', function () {
      var strategy = Object.create(new Strategy({ client: { redirect_uris: [ '/here' ] } }, function () {}));
      expect(strategy._callbackURL).to.eql('/here');
    });
  });

  describe('passReqToCallback', function () {
    it('defaults to false', function () {
      var strategy = Object.create(new Strategy({ callbackURL: '/here' }, function () {}));
      expect(strategy._passReqToCallback).to.be.false;
    });

    it('can be set to true', function () {
      var strategy = Object.create(new Strategy({ passReqToCallback: true, callbackURL: '/here' }, function () {}));
      expect(strategy._passReqToCallback).to.be.true;
    });
  });
});

describe('#authenticate', function (){
  var req;

  beforeEach(function (){
    req = { query: { } };
  });

  context('when __mock_strategy_callback is not set', function () {
    it('redirects the user to the callbackURL with the correct query param', function (done) {
      var strategy = Object.create(new Strategy({ callbackURL: '/cb' }, function () {}));
      strategy.redirect = function (path) {
        expect(path).to.eql('/cb?__mock_strategy_callback=true');
        done();
      };
      strategy.authenticate(req, {});
    });
  });

  context('when __mock_strategy_callback is set', function () {
    var strategy;

    beforeEach(function () {
      req.query.__mock_strategy_callback = true;
    });

    describe('#_error', function () {
      it('calls the fail method', function (done) {
        strategy = new Strategy({ callbackURL: '/cb' }, function (access_token, refresh_token, profile, cb) { cb(); });
        strategy._error = new Error('test error');
        strategy = Object.create(strategy);

        strategy.fail = function (err, statusCode) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.eql('test error');
          expect(statusCode).to.eql(401);
          expect(strategy._error).to.not.exist;
          done();
        };

        strategy.authenticate(req, {});
      });
    });

    context('when the verify arity is 6', function () {
      it('handles a verify method that asks for request, access token, refresh token, token response, and profile', function (done) {
        strategy = new Strategy({ callbackURL: '/cb', passReqToCallback: true }, function (request, access_token, refresh_token, token_response, profile, cb) {
          cb(null, {
            request: request,
            profile: profile,
            token_response: token_response,
            access_token: access_token,
            refresh_token: refresh_token
          });
        });
        strategy._token_response = { access_token: 'at', refresh_token: 'rt' };
        strategy._profile = { id: 1 };
        strategy = Object.create(strategy);

        strategy.success = function (data) {
          expect(data.request).to.eql(req);
          expect(data.access_token).to.eql('at');
          expect(data.refresh_token).to.eql('rt');
          expect(data.profile.id).to.eql(1);
          expect(data.token_response).to.have.keys('access_token')
          expect(data.token_response.access_token).to.eql('at');
          expect(data.token_response.refresh_token).to.not.exist;
          done();
        };

        strategy.authenticate(req, {});
      });
    });

    context('when the verify arity is 5', function () {
      context('when passReqToCallback is false', function () {
        it('handles a verify method that asks for access token, refresh token, token response, and profile', function (done) {
          strategy = new Strategy({ callbackURL: '/cb' }, function (access_token, refresh_token, token_response, profile, cb) {
            cb(null, {
              profile: profile,
              token_response: token_response,
              access_token: access_token,
              refresh_token: refresh_token
            });
          });

          strategy._token_response = { access_token: 'at', refresh_token: 'rt' };
          strategy._profile = { id: 1 };
          strategy = Object.create(strategy);

          strategy.success = function (data) {
            expect(data.access_token).to.eql('at');
            expect(data.refresh_token).to.eql('rt');
            expect(data.profile.id).to.eql(1);
            expect(data.token_response).to.have.keys('access_token')
            expect(data.token_response.access_token).to.eql('at');
            expect(data.token_response.refresh_token).to.not.exist;
            done();
          };

          strategy.authenticate(req, {});
        });
      });

      context('when passReqToCallback is true', function () {
        it('handles a verify method that asks for the request, access_token, refresh_token, and profile', function (done) {
          strategy = new Strategy({ callbackURL: '/cb', passReqToCallback: true }, function (request, access_token, refresh_token, profile, cb) {
            cb(null, {
              request: request,
              profile: profile,
              access_token: access_token,
              refresh_token: refresh_token
            });
          });

          strategy._token_response = { access_token: 'at', refresh_token: 'rt' };
          strategy._profile = { id: 1 };
          strategy = Object.create(strategy);

          strategy.success = function (data) {
            expect(data.access_token).to.eql('at');
            expect(data.refresh_token).to.eql('rt');
            expect(data.profile.id).to.eql(1);
            expect(data.request).to.eql(req);
            done();
          };

          strategy.authenticate(req, {});
        });

      });
    });

    context('when the verify arity is 4', function () {
      it('handles a verify method that asks for accessToken, refreshToken, and profile correctly', function (done) {
        strategy = new Strategy({ callbackURL: '/cb' }, function (access_token, refresh_token, profile, cb) {
          cb(null, {
            profile: profile,
            access_token: access_token,
            refresh_token: refresh_token
          });
        });

        strategy._token_response = { access_token: 'at', refresh_token: 'rt' };
        strategy._profile = { id: 1 };
        strategy = Object.create(strategy);

        strategy.success = function (data) {
          expect(data.access_token).to.eql('at');
          expect(data.refresh_token).to.eql('rt');
          expect(data.profile.id).to.eql(1);
          done();
        };
        strategy.authenticate(req, {});
      });
    });

    context('when the verify arity is 2', function () {
      it('handles a verify method that asks for tokenResponse correctly', function (done) {
        strategy = new Strategy({ callbackURL: '/cb' }, function (token_response, cb) {
          cb(null, { token_response: token_response });
        });

        strategy._token_response = { what: 'ever' };
        strategy = Object.create(strategy);

        strategy.success = function (data) {
          expect(data.token_response).to.eql({ what: 'ever' });
          done();
        };
        strategy.authenticate(req, {});
      });
    });
  });
});
