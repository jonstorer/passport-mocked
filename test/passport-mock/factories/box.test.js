var factory = require('../../../lib/passport-mock/factories/box');
var expect = require('chai').expect;

describe('profile for box', function () {
  describe('provider', function () {
    it('returns the correct provider', function () {
      expect(factory().provider).to.eql('box');
    });

    it('does not overwrite the provider', function () {
      expect(factory({ provider: 'anything else' }).provider).to.eql('box');
    });
  });

  describe('id', function () {
    it('returns a 9 digit number', function () {
      var profile = factory();
      expect(profile.id).to.be.a('number');
      expect(profile.id.toString()).to.have.length(9);
      expect(profile.id).to.eql(profile._json.id);
    });

    it('can be overwritten', function () {
      expect(factory({ id: 'anything' }).id).to.eql('anything');
    });
  });

  describe('displayName', function () {
    it('matches the pattern', function () {
      expect(factory().displayName).to.match(/\w+ \w+/)
    });

    it('can be overwritten by firstName', function () {
      expect(factory({ firstName: 'anything' }).displayName).to.matches(/anything \w+/);
    });

    it('can be overwritten by lastName', function () {
      expect(factory({ lastName: 'anything' }).displayName).to.matches(/\w+ anything/);
    });

    it('can be overwritten', function () {
      expect(factory({ firstName: 'mac', lastName: 'anything' }).displayName).to.eql('mac anything');
    });

    it('matches the _json', function () {
      var profile = factory({ firstName: 'mac', lastName: 'anything' });
      expect(profile.displayName).to.eql(profile._json.name);
    });
  });

  describe('emails', function () {
    it('returns the correct Contact Schema', function () {
      expect(factory().emails).to.have.length(1);
      expect(factory().emails[0]).to.have.keys('value');
    });

    it('returns an email comprised of firstName and lastName', function () {
      var profile = factory({ firstName: 'Jon', lastName: 'Mac Dougal' });
      expect(profile.emails[0].value).to.eql('jon.mac.dougal@example.com')
    });

    it('can be over written', function () {
      var profile = factory({ email: 'my@email.com' })
      expect(profile.emails[0].value).to.eql('my@email.com')
    });
  });

  describe('name', function () {
    it('returns the correct Portable Contact format', function () {
      expect(factory().name).to.be.an('object');
      expect(factory().name).to.have.keys('givenName', 'familyName', 'middleName');
    });

    describe('givenName', function (){
      it('returns a string', function () {
        var profile = factory();
        expect(profile.name.givenName).to.be.an('string')
        expect(profile.name.givenName).to.eql(profile._json.name.split(' ')[0]);
      });

      it('can be overwritten', function () {
        expect(factory({ firstName: 'Jon' }).name.givenName).to.eql('Jon');
      });
    });

    describe('familyName', function (){
      it('returns a string', function () {
        var profile = factory();
        expect(profile.name.familyName).to.be.an('string')
        expect(profile.name.familyName).to.eql(profile._json.name.split(' ')[1]);
      });

      it('can be overwritten', function () {
        expect(factory({ lastName: 'Smith' }).name.familyName).to.eql('Smith');
      });
    });

    describe('middleName', function (){
      it('returns a string', function () {
        expect(factory().name.middleName).to.be.an('string')
      });

      it('can be overwritten', function () {
        expect(factory({ middleName: 'Jacob' }).name.middleName).to.eql('Jacob');
      });
    });
  });

  describe('photos', function () {
    it('returns the correct Portable Contact format', function () {
      expect(factory().photos).to.be.an('array');
      expect(factory().photos).to.have.length(1);
      expect(factory().photos[0]).to.have.keys('value');
    });

    it('can be overwritten', function () {
      expect(factory({ avatar_url: '/hey' }).photos[0].value).to.eql('/hey')
      expect(factory({ avatar_url: '/hey' })._json.avatar_url).to.eql('/hey')
    });

    it('matches _json avatar_url', function () {
      var profile = factory();
      expect(profile.photos[0].value).to.eql(profile._json.avatar_url);
    });
  });

  describe('login', function () {
    it('returns the email', function () {
      var profile = factory();
      expect(profile.login).to.eql(profile.emails[0].value);
    });
  });

  describe('_raw', function () {
    it('is the stringified version of _json', function () {
      var profile = factory();
      expect(profile._raw).to.eql(JSON.stringify(profile._json, null, 4));
    });
  });

  describe('_json', function () {
    describe('type', function () {
      it('returns the type', function (){
        expect(factory()._json.type).to.eql('user');
      });
    });

    describe('id', function (){
      it('tested in profile.id');
    });

    describe('name', function (){
      it('tested in profile.displayName');
    });

    [ 'created_at', 'modified_at' ].forEach(function (property) {
      describe(property, function (){
        it('is a formatted string', function () {
          var profile = factory();
          expect(profile._json[property]).to.be.a('string');
          expect(profile._json[property]).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:00$/);
        });

        it('can be overwritten', function () {
          var date = new Date('12-11-1982');
          var opts = {}; opts[property] = date;
          var profile = factory(opts);
          expect(profile._json[property]).to.be.a('string');
          expect(Date.parse(profile._json[property])).to.be.closeTo(date.getTime(), 0);
          expect(profile._json[property]).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:00$/);
        });
      });
    });

    describe('language', function () {
      it('returns en', function (){
        expect(factory()._json.language).to.eql('en');
      });

      it('can be over written', function (){
        expect(factory({ language: 'es' })._json.language).to.eql('es');
      });
    });

    describe('timezone', function () {
      it('returns America/Los_Angeles', function (){
        expect(factory()._json.timezone).to.eql('America/Los_Angeles');
      });

      it('can be over written', function (){
        expect(factory({ timezone: 'there' })._json.timezone).to.eql('there');
      });
    });

    describe('timezone', function () {
      it('returns America/Los_Angeles', function (){
        expect(factory()._json.timezone).to.eql('America/Los_Angeles');
      });

      it('can be over written', function (){
        expect(factory({ timezone: 'there' })._json.timezone).to.eql('there');
      });
    });

    [ { key: 'space_amount', length: 11 },
      { key: 'space_used', length: 7 },
      { key: 'max_upload_size', length: 10 } ].forEach(function(property) {

      describe(property.key, function () {
        it('returns a number', function (){
          expect(factory()._json[property.key]).to.be.a('number')
          expect(factory()._json[property.key].toString()).to.have.length(property.length);
        });

        it('can be over written', function (){
          var opts = {}; opts[property.key] = 8;
          expect(factory(opts)._json[property.key]).to.eql(8)
        });
      });
    });

    describe('status', function () {
      it('returns active', function (){
        expect(factory()._json.status).to.eql('active');
      });

      it('can be over written', function (){
        expect(factory({ status: 'inactive' })._json.status).to.eql('inactive');
      });
    });

    describe('job_title', function () {
      it('returns a string', function (){
        expect(factory()._json.job_title).to.be.a('string');
      });

      it('can be over written', function (){
        expect(factory({ job_title: 'janitor' })._json.job_title).to.eql('janitor');
      });
    });

    describe('phone', function () {
      it('returns a string', function (){
        expect(factory()._json.phone).to.be.a('string');
      });

      it('can be over written', function (){
        expect(factory({ phone: '123' })._json.phone).to.eql('123');
      });
    });

    describe('address', function () {
      it('returns a string', function (){
        expect(factory()._json.address).to.be.a('string');
      });

      it('can be over written', function (){
        expect(factory({ address: '123 Main' })._json.address).to.eql('123 Main');
      });
    });

    describe('avatar_url', function () {
      it('is tested in profile.photos');
    });
  });
});
