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

  describe('name', function () {
    it('is tested in profile.displayName');
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
    describe('id', function () {
      it('is tested in profile.id');
    });

    describe('name', function () {
      it('is tested in profile.displayName');
    });

    describe('email', function () {
      it('is tested in profile.emails');
    });

    describe('gender', function () {
      it('returns male', function() {
        expect(factory()._json.gender).to.eql('male');
      });

      it('can be overwritten', function() {
        expect(factory({ gender: 'female' })._json.gender).to.eql('female');
      });
    });
  });
});
