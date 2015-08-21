var factory = require('../../../lib/passport-mock/factories/google');
var expect = require('chai').expect;

describe('profile for google', function () {
  describe('provider', function () {
    it('returns the correct provider', function () {
      expect(factory().provider).to.eql('google');
    });

    it('does not overwrite the provider', function () {
      expect(factory({ provider: 'anything else' }).provider).to.eql('google');
    });
  });

  describe('id', function () {
    it('returns the id', function () {
      var profile = factory();
      expect(profile.id).to.be.a('number');
      expect(profile.id.toString()).to.have.length(20);
      expect(profile.id).to.eql(profile._json.id);
    });

    it('can be overwritten', function () {
      var profile = factory({ id: 1 });
      expect(profile.id).to.eql(1);
    });
  });

  describe('displayName', function () {
    it('returns a string', function () {
      expect(factory().displayName).to.be.a('string');
    });

    it('is comprised of the givenName and familyName', function () {
      var profile = factory();
      expect(profile.displayName).to.eql(profile.name.givenName + ' ' + profile.name.familyName);
      expect(profile.displayName).to.eql(profile._json.given_name + ' ' + profile._json.family_name);
      expect(profile.displayName).to.eql(profile._json.name);
    });

    it('can be over written', function () {
      var profile = factory({ firstName: 'Jamie', lastName: 'Jackson' });
      expect(profile.displayName).to.eql('Jamie Jackson');
      expect(profile.displayName).to.eql(profile.name.givenName + ' ' + profile.name.familyName);
      expect(profile.displayName).to.eql(profile._json.given_name + ' ' + profile._json.family_name);
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

    describe('given_name', function () {
      it('is tested in profile.displayName');
    });

    describe('family_name', function () {
      it('is tested in profile.displayName');
    });

    describe('email', function () {
      it('is tested in profile.emails');
    });

    describe('verified_email', function () {
      it('returns a bool', function() {
        expect(factory()._json.verified_email).to.be.a('boolean');
      });

      it('defaults to true', function() {
        expect(factory()._json.verified_email).to.be.true;
      });

      it('can be overwritten', function() {
        expect(factory({ verified_email: false })._json.verified_email).to.be.false;
      });
    });

    describe('picture', function () {
      it('returns a url', function() {
        expect(factory()._json.picture).to.match(/https\:\/\/.+\/photo\.jpg/);
      });

      it('can be overwritten', function() {
        expect(factory({ picture: '/pic.png' })._json.picture).to.eql('/pic.png');
      });
    });

    describe('gender', function () {
      it('returns male', function() {
        expect(factory()._json.gender).to.eql('male');
      });

      it('can be overwritten', function() {
        expect(factory({ gender: 'female' })._json.gender).to.eql('female');
      });
    });

    describe('locale', function () {
      it('returns en', function() {
        expect(factory()._json.locale).to.eql('en');
      });

      it('can be overwritten', function() {
        expect(factory({ locale: 'es' })._json.locale).to.eql('es');
      });
    });

    describe('hd', function () {
      it('returns example.com', function() {
        expect(factory()._json.hd).to.eql('example.com');
      });

      it('can be overwritten', function() {
        expect(factory({ hd: 'yo.example.com' })._json.hd).to.eql('yo.example.com');
      });
    });

    describe('link', function () {
      it('returns the profile url', function() {
        profile = factory();
        expect(profile._json.link).to.eql('https://plus.google.com/' + profile.id);
      });

      it('can be overwritten', function() {
        expect(factory({ link: 'link.example.com/sup' })._json.link).to.eql('link.example.com/sup');
      });
    });
  });
});
