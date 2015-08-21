var utils = require('./utils');
var faker = require('faker');

module.exports = function Google (params) {
  params = params || {};

  var json = {
    id: params.id || utils.makeNumber(20),
    verified_email: ((typeof params.verified_email) != 'undefined' ? params.verified_email : true),
    given_name: params.firstName || faker.name.firstName(),
    family_name: params.lastName || faker.name.lastName(),
    picture: params.picture || 'https://lh4.googleusercontent.com/' + faker.random.uuid().split('-').join('/') + '/photo.jpg',
    gender: params.gender || 'male',
    locale: params.locale || 'en',
    hd: params.hd || 'example.com'
  };

  json.link = params.link || 'https://plus.google.com/' + json.id;
  json.email = params.email || utils.makeEmail(json.given_name, json.family_name);
  json.name = json.given_name + ' ' + json.family_name;

  return {
    provider: 'google',
    id: json.id,
    displayName: json.name,
    name: {
      familyName: json.family_name,
      givenName: json.given_name
    },
    emails: [ { value: json.email } ],
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};
