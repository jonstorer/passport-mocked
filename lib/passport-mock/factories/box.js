var utils = require('./utils');
var faker = require('faker');
var moment = require('moment');

module.exports = function Box (params) {
  params = params || {};

  var firstName = params.firstName || faker.name.firstName(),
      lastName = params.lastName || faker.name.lastName();

  var json = {
    type: 'user',
    id: params.id || utils.makeNumber(9),
    name: [ firstName, lastName ].join(' '),
    created_at: moment(params.created_at || new Date()).format('YYYY-MM-DDTHH:mm:ssZ'),
    modified_at: moment(params.modified_at || new Date()).format('YYYY-MM-DDTHH:mm:ssZ'),
    language: params.language || 'en',
    timezone: params.timezone || 'America/Los_Angeles',
    space_amount: params.space_amount || utils.makeNumber(11),
    space_used: params.space_used || utils.makeNumber(7),
    max_upload_size: params.max_upload_size || utils.makeNumber(10),
    status: params.status || 'active',
    job_title: params.job_title || faker.name.jobTitle(),
    phone: params.phone || faker.phone.phoneNumber(),
    address: params.address || faker.address.streetAddress() + ' ' + faker.address.city() + ', ' + faker.address.state(),
    avatar_url: params.avatar_url || faker.image.avatar()
  };

  json.login = params.email || utils.makeEmail.apply(null, json.name.split(' '))

  return {
    provider: 'box',
    id: json.id,
    displayName: json.name,
    name: {
      givenName: firstName,
      familyName: lastName,
      middleName: (params.middleName || faker.name.firstName())
    },
    emails: [ { value: json.login  } ],
    photos: [ { value: json.avatar_url } ],
    login: json.login,
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};
