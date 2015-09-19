var utils = require('./utils');
var faker = require('faker');

module.exports = function Github (params) {
  params = params || {};

  var firstName = params.firstName || faker.name.firstName()
    , lastName = params.lastName || faker.name.lastName();

  var json = {
    id: (params.id || utils.makeNumber(7)).toString(),
    name: [ firstName, lastName ].join(' '),
    login: params.username || params.login || faker.internet.userName(),
    // TODO: all this
    //gravatar_id: '',
    //followers_url: 'https://api.github.com/users/jonstorer/followers',
    //following_url: 'https://api.github.com/users/jonstorer/following{/other_user}',
    //gists_url: 'https://api.github.com/users/jonstorer/gists{/gist_id}',
    //starred_url: 'https://api.github.com/users/jonstorer/starred{/owner}{/repo}',
    //subscriptions_url: 'https://api.github.com/users/jonstorer/subscriptions',
    //organizations_url: 'https://api.github.com/users/jonstorer/orgs',
    //repos_url: 'https://api.github.com/users/jonstorer/repos',
    //events_url: 'https://api.github.com/users/jonstorer/events{/privacy}',
    //received_events_url: 'https://api.github.com/users/jonstorer/received_events',
    //type: 'User',
    //site_admin: false,
    //company: null,
    //blog: null,
    //location: 'New York, NY',
    //hireable: null,
    //bio: null,
    //public_repos: 45,
    //public_gists: 38,
    //followers: 15,
    //following: 8,
    //created_at: '2009-07-13T18:36:44Z',
    //updated_at: '2015-09-04T19:44:48Z'
  };

  json.email = params.email || utils.makeEmail(firstName, lastName);
  json.html_url = params.html_url || params.profileUrl || 'https://github.com/' + json.login;
  json.avatar_url = params.avatar_url || 'https://avatars.githubusercontent.com/u/' + json.id + '?v=3';
  json.url = params.url || 'https://api.github.com/users/' + json.login;

  return {
    provider: 'github',
    id: json.id,
    displayName: json.name,
    username: json.login,
    profileUrl: json.html_url,
    emails: [ { value: json.email } ],
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};
