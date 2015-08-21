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
      var strategy = new Strategy({ callbackURL: '/cb' }, function(){});
      expect(strategy.name).to.eql('mock')
    });

    it('can be set', function () {
      var strategy = new Strategy({ name: 'test', callbackURL: '/cb' }, function(){});
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
      var strategy = new Strategy({ callbackURL: '/here' }, function () {});
      expect(strategy._callbackURL).to.eql('/here');
    });
  });

  describe('#_factories', function () {
    var strategy;
    beforeEach(function(){
      strategy = new Strategy({ callbackURL: '/' }, function () {});
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
      strategy = new Strategy({ callbackURL: '/cb' }, function() { });
    });

    it('redirects the user to the callbackURL with the correct query param', function () {
      strategy.redirect = function(path) { expect(path).to.eql('/cb?__mock_strategy_callback=true'); };
      strategy.authenticate(req, {});
    });

    it('caches an access token on the strategy', function (done) {
      expect(strategy._access_token).not.to.exist;
      strategy.redirect = function(path) {
        expect(strategy._access_token).to.exist;
        done();
      };
      strategy.authenticate(req, {});
    });

    it('caches a refresh token on the strategy', function (done) {
      expect(strategy._refresh_token).not.to.exist;
      strategy.redirect = function(path) {
        expect(strategy._refresh_token).to.exist;
        done();
      };
      strategy.authenticate(req, {});
    });
  });

  context('second call', function () {
    context('failure', function () {
      beforeEach(function(){
        strategy = new Strategy({ callbackURL: '/cb' }, function (at, rt, p, cb) { cb(); });
        strategy.redirect = function () {};
        strategy._error = new Error('test error');
        strategy.authenticate(req, {});
      });

      it('calls the fail method', function (done) {
        strategy.fail = function(err, statusCode) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.eql('test error');
          expect(statusCode).to.eql(401);
          done();
        };
        req.query.__mock_strategy_callback = true;
        strategy.authenticate(req, {});
      });
    });

    context('success', function () {
      var accessToken, refreshToken, profile;

      beforeEach(function(){
        accessToken = refreshToken = profile = undefined;
        strategy = new Strategy({ callbackURL: '/cb' }, function (at, rt, p, cb) {
          accessToken = at;
          refreshToken = rt;
          profile = p;
          cb();
        });
        strategy.redirect = function () {};
        strategy.authenticate(req, {});
        req.query.__mock_strategy_callback = true;
      });

      it('handles the access token correctly', function (done) {
        var holdToken = strategy._access_token;
        expect(strategy._access_token).to.exist;
        expect(accessToken).to.not.exist;
        strategy.success = function(user) {
          expect(strategy._access_token).not.to.exist;
          expect(accessToken).to.eql(holdToken);
          done();
        };
        strategy.authenticate(req, {});
      });

      it('handles the refresh token correctly', function (done) {
        var holdToken = strategy._refresh_token;
        expect(strategy._refresh_token).to.exist;
        expect(refreshToken).to.not.exist;
        strategy.success = function(user) {
          expect(strategy._refresh_token).not.to.exist;
          expect(refreshToken).to.eql(holdToken);
          done();
        };
        strategy.authenticate(req, {});
      });

      it('handles the profile correctly', function (done) {
        var profile = strategy._factory.build('Dropbox', { email: 'test@example.com', id: '1234 ' });
        strategy._profile = strategy
        strategy.success = function(user) {
          expect(strategy._profile).to.not.exist;
          expect(profile).to.eql(profile);
          done();
        };
        strategy.authenticate(req, {});
      });
    });
  });
});
