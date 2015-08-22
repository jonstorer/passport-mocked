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
        //strategy.redirect = function () {};
        //strategy.authenticate(req, {});
        req.query.__mock_strategy_callback = true;
      });

      it('creates an access token on the fly', function (done) {
        expect(strategy._accessToken).to.not.exist;
        expect(accessToken).to.not.exist;
        strategy.success = function(user) {
          expect(accessToken).to.have.length(40);
          done();
        };
        strategy.authenticate(req, {});
      });

      it('will use the provided accessToken', function (done) {
        strategy._accessToken = 'my token';
        strategy.success = function(user) {
          expect(accessToken).to.eql('my token');
          expect(strategy._accessToken).to.not.exist;
          done();
        };
        strategy.authenticate(req, {});
      });

      it('creates a refresh token on the fly', function (done) {
        expect(strategy._refreshToken).to.not.exist;
        expect(refreshToken).to.not.exist;
        strategy.success = function(user) {
          expect(strategy._refreshToken).to.not.exist;
          expect(refreshToken).to.have.length(40);
          done();
        };
        strategy.authenticate(req, {});
      });

      it('will use the provided refreshToken', function (done) {
        strategy._refreshToken = 'my token';
        strategy.success = function(user) {
          expect(refreshToken).to.eql('my token');
          expect(strategy._refreshToken).to.not.exist;
          done();
        };
        strategy.authenticate(req, {});
      });

      it('handles the profile correctly', function (done) {
        var tmpProfile = strategy._factory.build('Dropbox', { email: 'test@example.com', id: '1234 ' });
        strategy._profile = tmpProfile;
        strategy.success = function(user) {
          expect(strategy._profile).to.not.exist;
          expect(profile).to.eql(tmpProfile);
          done();
        };
        strategy.authenticate(req, {});
      });

      it.only('will create a profile based on the name if one was not provided', function (done) {
        strategy._factory.add('for-tests', function () { return 'hey!' });
        strategy.name = 'for-tests';
        strategy.success = function(user) {
          expect(profile).to.eql('hey!');
          done();
        };
        strategy.authenticate(req, {});
      });
    });
  });
});
