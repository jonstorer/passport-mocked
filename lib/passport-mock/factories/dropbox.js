var utils = require('./utils');
var faker = require('faker');

module.exports = function Dropbox (params) {
  params = params || {};

  var json = {
    name_details: {
      given_name: (params.firstName || faker.name.firstName()),
      surname: (params.lastName || faker.name.lastName()),
      familiar_name: (params.nickName || faker.name.firstName())
    },
    team: {
      team_id: (params.team_id || 'dbtid: ' + utils.makeToken(10)),
      name: (params.team_name || faker.company.companyName()),
    },
    quota_info: {
      datastores: (params.datastores || utils.makeNumber(20)),
      shared: (params.shared || utils.makeNumber(17)),
      quota: (params.quota || utils.makeNumber(18)),
      normal: (params.normal || utils.makeNumber(17))
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
    provider: 'dropbox',
    id: json.uid,
    displayName: json.display_name,
    emails: [ { email: json.email } ],
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};
