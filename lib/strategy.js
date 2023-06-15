const util = require('util');
const passport = require('passport-strategy');

function MockStrategy (options, verify) {
  options ||= {}

  this._callbackURL = options.callbackURL || options.callbackUrl || options.redirect_uri || (options.redirect_uris?.length && options.redirect_uris[0])
  this.name = options.name || 'mocked';
  this._passReqToCallback = options.passReqToCallback || false;
  this.verify = verify;
  this._verifyArgs = [];

  if (!this._callbackURL) { throw new TypeError('MockStrategy requires a callbackURL'); }
  if (!this.verify) { throw new TypeError('MockStrategy requires a verify callback'); }
}

passport.Strategy.call(this);

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function authenticate (req, options) {
  if (!req.query.__mock_strategy_callback) {
    this.redirect(this._callbackURL + '?__mock_strategy_callback=true');
  } else {
    this._getNextVerifyArgs().then((args) => {
      if (this._passReqToCallback) { args.unshift(req) }

      this.verify(...args, (err, data, info) => { this.success(data, info); })
    }).catch(this.error)
  }
}

MockStrategy.prototype._addVerifyArgs = function (...args) {
  this._verifyArgs.push(args)
}

MockStrategy.prototype._getNextVerifyArgs = function () {
  return new Promise((resolve, reject) => {
    const args = this._verifyArgs.shift();
    if(!args) { return reject(new Error('MockStrategy requires arguments to be defined for each authentication')) }
    if(args.length === 1 && args[0].name === 'Error') { return reject(args[0]) }
    resolve(args)
  })
}

module.exports = MockStrategy;
