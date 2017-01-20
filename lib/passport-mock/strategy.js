var util = require('util');
var passport = require('passport');
var Factory = require('./factory');
var utils = require('./factories/utils');

function MockStrategy (options, verify) {
  if (!verify) { throw new TypeError('MockStrategy requires a verify callback'); }
  if (!options.callbackURL) { throw new TypeError('MockStrategy requires a callbackURL'); }

  this.name = options.name || 'mock';
  this.verify = verify;
  this._callbackURL = options.callbackURL;
  this._passReqToCallback = options.passReqToCallback || false;
  this._factory = new Factory();

  var factories = require('./factories/factories')
  for (factoryName in factories) {
    this._factory.add(factoryName, factories[factoryName])
    this._factory.add(factoryName.toLowerCase(), factories[factoryName])
  }
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function authenticate (req, options) {
  if (req.query.__mock_strategy_callback) {
    if (this._error) {
      var error = this._error;
      this.__proto__ && delete this.__proto__._error;
      this.fail(error, 401);
    } else {
      var verified = function (e, d) { this.success(d); }.bind(this);

      var accessToken = this._accessToken || utils.makeToken(40);
      var refreshToken = this._refreshToken || utils.makeToken(40);
      var expiresIn = this._expires_in || 3600;
      var tokenType = this._token_type || 'access_token';
      var scope = this._scope || 'none';

      var params = { access_token: accessToken, expires_in: expiresIn,
                     scope: scope, token_type: tokenType };

      var profile = this._profile;
      if (!profile && this._factory.isDefined(this.name)) {
        profile = this._factory.build(this.name);
      };

      if (this.__proto__) {
        delete this.__proto__._accessToken;
        delete this.__proto__._refreshToken;
        delete this.__proto__._profile;
        delete this.__proto__._expires_in;
        delete this.__proto__._scope;
        delete this.__proto__._token_type;
      };

      var args = [req, accessToken, refreshToken, params, profile, verified];

      var arity = this.verify.length;

      if (arity === 6) {
        this.verify(req, accessToken, refreshToken, params, profile, verified);
      } else if (arity === 5) {
        if (this._passReqToCallback) {
          this.verify(req, accessToken, refreshToken, profile, verified);
        } else {
          this.verify(accessToken, refreshToken, params, profile, verified);
        };
      } else { // arity === 4
        this.verify(accessToken, refreshToken, profile, verified);
      }

    }
  } else {
    this.redirect(this._callbackURL + '?__mock_strategy_callback=true');
  }
}

module.exports.Strategy = MockStrategy;
module.exports.OAuth2Strategy = MockStrategy;
