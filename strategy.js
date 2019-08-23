var Promise = require('bluebird');
var URL = require('url');

module.exports = function (passport, util) {
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); }

  function MockStrategy (options, verify) {
    if (!(options.callbackURL || options.redirect_uri || options.client.redirect_uris[0])) { throw new TypeError('MockStrategy requires a callbackURL'); }

    if (!verify) {
      this.verify = function(tokenset, next) {
        next(null, { accessToken: tokenset.access_token, refreshToken: tokenset.refresh_token, idToken: tokenset.claims });
      };
    } else {
      this.verify = verify;
    }

    this.name = options.name || 'mocked';
    this._callbackURL = (options.callbackURL || options.redirect_uri || options.client.redirect_uris[0]);
    this._passReqToCallback = options.passReqToCallback || false;
  }

  util.inherits(MockStrategy, passport.Strategy);

  MockStrategy.prototype.authenticate = function authenticate (req, options) {
    if (!req.query.__mock_strategy_callback) {
      this.redirect(this._callbackURL + '?__mock_strategy_callback=true');
    } else {
      if (this._error) {
        var error = this._error;
        this.__proto__ && delete this.__proto__._error;
        this.fail(error, 401);
      } else {
        var verified = function (e, d) { this.success(d); }.bind(this);

        var token_set = clone(this._token_response || {});
        var profile = this._profile || {};
        var token_response = clone(this._token_response || {});
        var access_token = token_response['access_token'];
        var refresh_token = token_response['refresh_token'];
        delete token_response['refresh_token'];

        if (this.__proto__) {
          delete this.__proto__._token_response;
          delete this.__proto__._profile;
        };

        var arity = this.verify.length;
        if (arity === 6) {
          this.verify(req, access_token, refresh_token, token_response, profile, verified);
        } else if (arity === 5) {
          if (this._passReqToCallback) {
            this.verify(req, access_token, refresh_token, profile, verified);
          } else {
            this.verify(access_token, refresh_token, token_response, profile, verified);
          };
        } else if (arity === 4) {
          this.verify(access_token, refresh_token, profile, verified);
        } else if (arity === 2) {
          this.verify(token_set, verified);
        }
      }
    }
  }

  function Client (config) {
    return new Promise(function (res, rej) {
      config.issuer = {
        end_sessions_endpoint: URL.parse(config.issuer.host).host + '/logout'
      }
      res(config);
    });
  }

  let Issuer = (function () {
    let self = {};

    self.discover = function (url) {
      return new Promise(function (res, rej) {
        !!url ? res({ Client: Client }) : rej('Issuer requires a url');
      });
    }

    return self;
  })();

  return {
    Issuer: Issuer,
    Strategy: MockStrategy,
    OAuth2Strategy: MockStrategy,
    OAuth2: {
      PasswordStrategy: MockStrategy,
      AuthorizationCodeStrategy: MockStrategy
    }
  };
};
