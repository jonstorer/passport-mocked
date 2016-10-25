var utils = require('./utils');
var faker = require('faker');

module.exports = function Legalshield (params) {
  params = params || {};

  var json = {
    name_details: {
      given_name: (params.firstName || faker.name.firstName()),
      surname: (params.lastName || faker.name.lastName()),
      familiar_name: (params.nickName || faker.name.firstName())
    },
    basic_profile: {
        id: "10129535992",
        login: "ekump               ",
        email: params.email || utils.makeEmail(params.firstName, params.lastName),
        first_name: null,
        last_name: null,
        is_member: true,
        is_provider: false,
        is_associate: false,
        is_broker: false
    },
    referral_link: (params.referralLink || 'https://db.tt/' + utils.makeToken(10)),
    uid: (params.id || utils.makeNumber(10)),
    locale: (params.locale || 'en'),
    country: (params.country || 'US'),
    is_paired: !!params.isPaired,
    email_verified: (typeof params.emailVerified == 'undefined' ? true : params.emailVerified)
  };

  json.display_name = params.displayName || json.name_details.given_name + ' ' + json.name_details.surname;
  json.email = params.email || utils.makeEmail(json.name_details.given_name, json.name_details.surname);

  return {
    provider: 'legalshield',
    id: json.uid,
    displayName: json.display_name,
    emails: [ { email: json.email } ],
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};
