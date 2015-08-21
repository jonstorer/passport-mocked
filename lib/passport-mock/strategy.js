var util = require('util');
var passport = require('passport');
var Factory = require('./factory');
var utils = require('./factories/utils');

function MockStrategy (options, verify) {
  if (!verify) { throw new TypeError('MockStrategy requires a verify callback'); }
  if (!options.callbackURL) { throw new TypeError('MockStrategy requires a callbackURL'); }

  this.name = options.name || 'mock';
  this.verify = verify;
  this._callbackURL = options.callbackURL,
  this._factory = new Factory();

  var factories = require('./factories/factories')
  for (factoryName in factories) {
    this._factory.add(factoryName, factories[factoryName])
  }
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function authenticate (req, options) {
  if (req.query.__mock_strategy_callback) {
    if (this._error) {
      this.fail(this._error, 401);
    } else {
      var profile = this._profile
        , access_token = this._access_token
        , refresh_token = this._refresh_token;
      delete this._profile;
      delete this._access_token;
      delete this._refresh_token;

      this.verify(access_token, refresh_token, profile, function (err, user) {
        this.success(user);
      }.bind(this));
    }
  } else {
    this._access_token = utils.makeToken(30);
    this._refresh_token = utils.makeToken(30);
    this.redirect(this._callbackURL + '?__mock_strategy_callback=true');
  }
}

module.exports.Strategy = MockStrategy;
module.exports.OAuth2Strategy = MockStrategy;
