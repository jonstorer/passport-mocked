const util = require('util');
const passport = require('passport-strategy');

module.exports = require('./strategy')(passport, util);
