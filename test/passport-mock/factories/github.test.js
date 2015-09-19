var factory = require('../../../lib/passport-mock/factories/github');
var expect = require('chai').expect;

describe('profile for github', function () {
  describe('provider', function () {
    it('returns the correct provider', function () {
      expect(factory().provider).to.eql('github');
    });

    it('does not overwrite the provider', function () {
      expect(factory({ provider: 'anything else' }).provider).to.eql('github');
    });
  });

  describe('id', function () {
    it('returns the id', function () {
      var profile = factory();
      expect(profile.id).to.be.a('string');
      expect(profile.id).to.have.length(7);
      expect(profile.id).to.eql(profile._json.id);
    });

    it('can be overwritten', function () {
      var profile = factory({ id: 1 });
      expect(profile.id).to.eql('1');
    });
  });

  describe('displayName', function () {
    it('returns a string', function () {
      expect(factory().displayName).to.be.a('string');
    });

    it('matches _json.name', function () {
      var profile = factory();
      expect(profile.displayName).to.eql(profile._json.name);
    });

    it('can be over written', function () {
      var profile = factory({ firstName: 'Jamie', lastName: 'Jackson' });
      expect(profile.displayName).to.eql('Jamie Jackson');
      expect(profile.displayName).to.eql(profile._json.name);
    });
  });

  describe('username', function () {
    it('returns a string', function () {
      expect(factory().username).to.be.a('string');
    });

    it('matches _json.name', function () {
      var profile = factory();
      expect(profile.username).to.eql(profile._json.login);
    });

    it('can be over written (as username)', function () {
      var profile = factory({ username: 'boomav' });
      expect(profile.username).to.eql('boomav');
      expect(profile.username).to.eql(profile._json.login);
    });

    it('can be over written (as login)', function () {
      var profile = factory({ login: 'boomav' });
      expect(profile.username).to.eql('boomav');
      expect(profile.username).to.eql(profile._json.login);
    });
  });

  describe('profileUrl', function () {
    it('returns a string', function () {
      expect(factory().profileUrl).to.be.a('string');
    });

    it('matches _json.name', function () {
      var profile = factory();
      expect(profile.profileUrl).to.eql(profile._json.html_url);
    });

    it('can be over written (as username)', function () {
      var profile = factory({ profileUrl: '/boomav' });
      expect(profile.profileUrl).to.eql('/boomav');
      expect(profile.profileUrl).to.eql(profile._json.html_url);
    });

    it('can be over written (as html_url)', function () {
      var profile = factory({ html_url: '/boomav' });
      expect(profile.profileUrl).to.eql('/boomav');
      expect(profile.profileUrl).to.eql(profile._json.html_url);
    });
  });

  describe('emails', function () {
    it('has the correct Portable Contacts format', function () {
      var profile = factory();
      expect(profile.emails).to.be.an('array');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0]).to.have.keys('value');
    });

    it('is built from givenName & familyName', function () {
      var profile = factory({ firstName: 'Nick', lastName: 'Gonzoles' });
      expect(profile.emails[0].value).to.eql('nick.gonzoles@example.com');
    });

    it('can be overwritten', function () {
      var profile = factory({ email: 'yo@yo.io' });
      expect(profile.emails[0].value).to.eql('yo@yo.io');
      expect(profile.emails[0].value).to.eql(profile._json.email);
    });
  });

  describe('_raw', function () {
    it('is the string version of _json', function () {
      var profile = factory();
      expect(profile._raw).to.eql(JSON.stringify(profile._json, null, 4));
    });
  });

  describe('_json', function () {
    var profile;
    before(function () {
      profile = factory();
    });

    describe('id', function () {
      it('is tested in profile.id');
    });

    describe('name', function () {
      it('is tested in profile.displayName');
    });

    describe('email', function () {
      it('is tested in profile.emails');
    });

    describe('login', function () {
      it('is testing in profileUrl');
    });

    describe('avatar_url', function () {
      it('is formatted_correctly', function () {
        expect(profile._json.avatar_url).to.eql('https://avatars.githubusercontent.com/u/' + profile.id + '?v=3');
      });

      it('is overwriteable', function () {
        var profile = factory({ avatar_url: '/pic' })
        expect(profile._json.avatar_url).to.eql('/pic');
      });
    });

    describe('url', function () {
      it('is formatted_correctly', function () {
        expect(profile._json.url).to.eql('https://api.github.com/users/' + profile.username);
      });

      it('is overwriteable', function () {
        var profile = factory({ url: '/pic' })
        expect(profile._json.url).to.eql('/pic');
      });
    });
  });
});
