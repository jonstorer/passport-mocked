var Factory;

function Factory () {
  this._factories = { };
};

Factory.prototype.add = function (name, fn) {
  this._factories[name] = fn;
};

Factory.prototype.build = function () {
  var args = Array.prototype.slice.call(arguments)
    , name = args.shift()
    , factory = this._factories[name];

  if (!factory) { throw TypeError(name + ' has not been defined'); }

  return factory.apply(null, args);
};

Factory.prototype.isDefined = function (name) {
  return !!this._factories[name];
};

module.exports = Factory;
