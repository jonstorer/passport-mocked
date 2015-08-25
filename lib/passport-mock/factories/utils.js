var faker = require('faker');

exports.makeEmail = function () {
  return (Array.prototype.slice.call(arguments).map(function(v) { return v.replace(/\W/g,''); }).join('.') + '@example.com').toLowerCase();
}

exports.makeNumber = function (length) {
  var length = length - 1, base = Math.pow(10, length);
  return base + faker.random.number(base);
}

exports.makeToken = function (length) {
  var token = '';
  while (token.length < length) { token += faker.random.uuid().split('-').join(''); };
  return token.substring(0, length);
}
