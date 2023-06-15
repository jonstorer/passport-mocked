const Strategy = require('../').Strategy
  , expect = require('chai').expect
  , PassportStrategy = require('passport-strategy').Strategy
  , passport = require('passport');

passport.serializeUser((d, c) => c(null, d));
passport.deserializeUser((d, c) => c(null, d));

it('inherits from passport', function () {
  expect(Strategy.super_).to.eql(PassportStrategy);
});

describe('setup', function () {
  describe('name', function () {
    it('has a default', function () {
      expect(new Strategy({ callbackURL: '/cb' }, () => {}).name).to.eql('mocked')
    });

    it('can be overwritten', function () {
      expect(new Strategy({ name: 'test', callbackURL: '/cb' }, () => {}).name).to.eql('test')
    });
  });

  describe('_callbackURL', function () {
    it('requires a callback url', function () {
      expect(function () { new Strategy({}, () => {}) }).to.throw('MockStrategy requires a callbackURL')
    });

    [
      'callbackURL',
      'callbackUrl',
      'redirect_uri',
    ].forEach(function (name) {
      it(`accepts '${name}'`, function () {
        const opts = {}; opts[name] = '/'
        expect(new Strategy(opts, () => {})._callbackURL).to.eql('/')
      });
    })

    it("accepts 'redirect_uris'", function () {
      expect(new Strategy({ redirect_uris: ['/'] }, () => {})._callbackURL).to.eql('/')
    });
  })

  describe('_passReqToCallback', function () {
    it('defaults to false', function () {
      expect(new Strategy({ callbackURL: '/cb' }, () => {})._passReqToCallback).to.be.false
    });

    it('can be overwritten to true', function () {
      expect(new Strategy({ callbackURL: '/cb', passReqToCallback: true }, () => {})._passReqToCallback).to.be.true
    });
  });

  describe('verify', function () {
    it('requires a verify callback', function () {
      expect(function () { new Strategy({ callbackUrl: '/' }) }).to.throw('MockStrategy requires a verify callback')
    })
  });
});

describe('#authenticate', function (){
  let req, res, strategy, next;

  beforeEach(function (){
    req = { }
    req.query = { }
    req.session = {
      regenerate: (cb) => cb(),
      save: (cb) => cb()
    }

    res = {}
    res.headers = {}
    res.redirect = (path) => { throw new Error(`redirected to ${path}`)}
    res.end = () => {}
    res.setHeader = function (k, v) { this.headers[k] = v }.bind(res)

    next = (...args) => { throw new Error(`next called with ${args.join(', ')}`) }
  });

  context('when __mock_strategy_callback is not set', function () {
    beforeEach(function (done) {
      res.end = done

      passport.use(new Strategy({ name: 'mocked', callbackURL: '/cb' }, () => {}));
      passport.authenticate('mocked')(req, res, next)
    })

    it('redirects the user to the callbackURL with the correct query param', function () {
      expect(res.headers['Location']).to.eql('/cb?__mock_strategy_callback=true');
    });
  });

  context('when __mock_strategy_callback is set', function () {
    beforeEach(function () {
      req.query.__mock_strategy_callback = true;
    });

    context('verify callback', () => {
      beforeEach(function (done) {
        strategy = new Strategy({ callbackURL: '/cb' }, function (...args) {
          const cb = args.pop()
          cb(null, { ...args });
        });

        strategy._addVerifyArgs('token');

        passport.use(strategy)
        passport.authenticate('mocked')(req, res, done)
      })

      it('calls the verify method with the persisted set of args', function () {
        expect(req.session.passport.user).to.eql({ '0': 'token' })
      });

      context('no more verifyArgs', function () {
        let err

        beforeEach(function (done) {
          passport.authenticate('mocked')(req, res, (_err) => {
            err = _err
            done()
          })
        })

        it('returns an error if there are no more args', function () {
          expect(err).to.exist
          expect(err.message).to.eql('MockStrategy requires arguments to be defined for each authentication')
        });
      })
    })

    context('override callback', () => {
      let err, user, info

      beforeEach(function (done) {
        strategy = new Strategy({ callbackURL: '/cb' }, function (user, info, cb) {
          cb(null, user, info);
        });

        const callback = (_err, _user, _info) => {
          err = _err
          user = _user
          info = _info
          done()
        }

        strategy._addVerifyArgs('user', 'info');

        passport.use(strategy)
        passport.authenticate('mocked', callback)(req, res, done)
      })

      it('passes the user and info arguments', function () {
        expect(err).to.not.exist
        expect(user).to.eql('user')
        expect(info).to.eql('info')
      });
    })

    describe('error', function () {
      let err

      beforeEach(function (done) {
        strategy = new Strategy({ callbackURL: '/cb' }, function (...args) {
          const cb = args.pop()
          cb(null, { ...args });
        });

        strategy._addVerifyArgs(new Error('sww'));

        passport.use(strategy)
        passport.authenticate('mocked')(req, res, (_err) => {
          err = _err;
          done();
        });
      })

      it('errors correctly with given a single verify argument', function () {
        expect(err).to.exist
        expect(err.message).to.eql('sww')
      });
    });

    context('when passReqToCallback: true', function () {
      let _req;

      beforeEach(function (done) {
        strategy = new Strategy({ callbackURL: '/cb', passReqToCallback: true }, function (req, token, cb) {
          _req = req
          cb(null, { token });
        });

        strategy._addVerifyArgs('token');

        passport.use(strategy)
        passport.authenticate('mocked')(req, res, done)
      });

      it('passes the request into the verify method', function () {
        expect(_req).to.eql(req)
      });
    });
  });
});
