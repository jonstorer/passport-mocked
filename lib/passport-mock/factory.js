var Factory;

function Factory () {
  this._factories = { };
};

Factory.prototype.add = function (name, fn) {
  this._factories[name] = fn;
};

Factory.prototype.build = function () {
  var args = Array.prototype.slice.call(arguments);
  return this._factories[args.shift()].apply(null, args);
};

module.exports = Factory;
