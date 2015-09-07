var utils = require('./utils');
var faker = require('faker');

module.exports = function Github (params) {
  params = params || {};

  var firstName = params.firstName || faker.name.firstName()
    , lastName = params.lastName || faker.name.lastName();

  var json = {
    id: (params.id || utils.makeNumber(7)).toString(),
    name: [ firstName, lastName ].join(' '),
    //login: 'jonstorer',
    //avatar_url: 'https://avatars.githubusercontent.com/u/104508?v=3',
    //gravatar_id: '',
    //url: 'https://api.github.com/users/jonstorer',
    //html_url: 'https://github.com/jonstorer',
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

  //json.link = params.link || 'https://plus.google.com/' + json.id;
  json.email = params.email || utils.makeEmail(firstName, lastName);
  //json.name = json.given_name + ' ' + json.family_name;

  return {
    provider: 'github',
    id: json.id,
    displayName: json.name,
    //name: {
      //familyName: json.family_name,
      //givenName: json.given_name
    //},
    emails: [ { value: json.email } ],
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};

//username: 'jonstorer',
//profileUrl: 'https://github.com/jonstorer',
//emails: [ { value: 'jonathon.scott.storer@gmail.com' } ],
