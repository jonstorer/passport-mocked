var util = require('util');
var passport = require('passport');

module.exports = require('./strategy')(passport, util);
