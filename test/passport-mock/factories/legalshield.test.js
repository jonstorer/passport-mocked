var factory = require('../../../lib/passport-mock/factories/legalshield');
var expect = require('chai').expect;

describe('profile for legalshield', function () {
  describe('provider', function () {
    it('returns the correct provider', function () {
      expect(factory().provider).to.eql('legalshield');
    })

    it('does not overwrite the provider', function () {
      expect(factory({ provider: 'anything else' }).provider).to.eql('legalshield');
    })
  });

  describe('id', function () {
    it('returns a numberical id', function () {
      expect(factory().id).to.be.a('number');
      expect(factory().id.toString()).to.have.length(10);
    });

    it('can be overwritten', function () {
      var profile = factory({ id: 1234 });
      expect(profile.id).to.eql(1234);
      expect(profile.id).to.eql(profile._json.Member._json.membership_number);
      expect(profile.id).to.eql(profile._json.Member.id);
    });

    it('matches the _json uuid', function () {
      var profile = factory();
      expect(profile.id).to.eql(profile._json.Member._json.membership_number);
    });
  });

  describe('displayName', function () {
    it('returns a two part string', function () {
      expect(factory().displayName).to.match(/\w+ \w+/)
    });

    it('is comprised of the first name and last name', function () {
      var profile = factory();
      expect(profile.displayName).to.eql(profile._json.Member.name.givenName + ' ' + profile._json.Member.name.familyName);
    });

    it('can be overwritten just first name', function () {
      var profile = factory({ firstName: 'Galatea' });
      expect(profile.displayName.split(' ')[0]).to.eql('Galatea');
      expect(profile._json.Member.name.givenName).to.eql('Galatea');
    });

    it('can be overwritten just last name', function () {
      var profile = factory({ lastName: 'Dunkel' });
      expect(profile.displayName.split(' ')[1]).to.eql('Dunkel');
      expect(profile._json.Member.name.familyName).to.eql('Dunkel');
    });

    it('can be overwritten completely', function () {
      var profile = factory({ firstName: 'Randall', lastName: 'Dunkel' });
      expect(profile.displayName).to.eql('Randall Dunkel');
    });
  });

  describe('emails', function () {
    it('matches the format', function () {
      var profile = factory();
      expect(profile.emails[0].email).to.match(/\w+\.\w+@example\.com/)
    });

    it('matches the _json', function () {
      var profile = factory();
      expect(profile.emails[0].email).to.eql(profile._json.Member.emails[0].value);
    });

    it('can be overwritten', function () {
      var profile = factory({ email: 'test@test.test' });
      expect(profile.emails[0].email).to.eql('test@test.test')
      expect(profile._json.Member.emails[0].value).to.eql('test@test.test')
    });

    it('is built from firstName, lastName', function () {
      var profile = factory({ firstName: 'bob', lastName: 'Mac Dougal' });
      expect(profile.emails[0].email).to.eql('bob.macdougal@example.com');
      expect(profile._json.Member.emails[0].value).to.eql('bob.macdougal@example.com');
    });
  });

  describe('_raw', function () {
    it('is the string version of _json', function () {
      var profile = factory();
      expect(profile._raw).to.eql(JSON.stringify(profile._json, null, 4));
    });
  });

  describe('_json', function (){
    describe('access_control', function (){
      describe('allow_emergency_access', function (){
        it('returns a default value of false', function () {
          expect(factory()._json.Member._json.access_control.allow_emergency_access).to.be.false;
        });
        it('can be over written', function () {
          expect(factory({ access_control: { allow_emergency_access: true }})._json.Member._json.access_control.allow_emergency_access).to.be.true;
        });
      });
      describe('allow_will_preparation', function (){
        it('returns a default value of false', function () {
          expect(factory()._json.Member._json.access_control.allow_will_preparation).to.be.false;
        });
        it('can be over written', function () {
          expect(factory({ access_control: { allow_will_preparation: true }})._json.Member._json.access_control.allow_will_preparation).to.be.true;
        });
      });
      describe('allow_idshield_dashboard', function (){
        it('returns a default value of false', function () {
          expect(factory()._json.Member._json.access_control.allow_idshield_dashboard).to.be.false;
        });
        it('can be over written', function () {
          expect(factory({ access_control: { allow_idshield_dashboard: true }})._json.Member._json.access_control.allow_idshield_dashboard).to.be.true;
        });
      });
      describe('allow_speeding_ticket_upload', function (){
        it('returns a default value of false', function () {
          expect(factory()._json.Member._json.access_control.allow_speeding_ticket_upload).to.be.false;
        });
        it('can be over written', function () {
          expect(factory({ access_control: { allow_speeding_ticket_upload: true }})._json.Member._json.access_control.allow_speeding_ticket_upload).to.be.true;
        });
      });
      describe('allow_member_perks', function () {
        it('returns a default value of false', function () {
          expect(factory()._json.Member._json.access_control.allow_member_perks).to.be.false;
        });
        it('can be over written', function () {
          expect(factory({ access_control: { allow_member_perks: true }})._json.Member._json.access_control.allow_member_perks).to.be.true;
        });
      });
    });
    describe('basic profile', function () {
      describe('id', function (){
        it('can be over written', function() {
          expect(factory({ id: '1234' })._json.basic_profile.id).to.eql('1234');
        });
      });
      describe('login', function () {
        it('can be over written', function() {
          expect(factory({ login: 'slayer' })._json.basic_profile.login).to.eql('slayer');
        });
      });
      describe('is_member', function () {
        it('returns a default value of true', function () {
          expect(factory()._json.basic_profile.is_member).to.be.true;
        });
        it('can be over written', function() {
          expect(factory({ is_member: true })._json.basic_profile.is_member).to.be.true;
        });
      });
      describe('is_provider', function () {
        it('can be over written', function() {
          expect(factory({ is_provider: true })._json.basic_profile.is_provider).to.be.true;
        });
      });
      describe('is_associate', function () {
        it('can be over written', function() {
          expect(factory({ is_associate: true })._json.basic_profile.is_associate).to.be.true;
        });
      });
      describe('is_broker', function () {
        it('can be over written', function() {
          expect(factory({ is_broker: true  })._json.basic_profile.is_broker).to.be.true;
        });
      });
    });
  });
});
