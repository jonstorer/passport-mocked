var faker = require('faker');
var moment = require('moment');
var Dropbox, Box, Google;

var email = function () {
  return (Array.prototype.slice.call(arguments).map(function(v) { return v.replace(/\W/g,''); }).join('.') + '@example.com').toLowerCase();
};

var number = function(length) {
  var length = length - 1, base = Math.pow(10, length);
  return base + faker.random.number(length);
}

var factories = exports;

factories.token = function () {
  return [,,].map(function(){ return faker.random.uuid().split('-').join(''); }).join('');
}
