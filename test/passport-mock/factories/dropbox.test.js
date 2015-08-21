var factory = require('../../../lib/passport-mock/factories/dropbox');
var expect = require('chai').expect;

describe('profile for dropbox', function () {
  describe('provider', function () {
    it('returns the correct provider', function () {
      expect(factory().provider).to.eql('dropbox');
    })

    it('does not overwrite the provider', function () {
      expect(factory({ provider: 'anything else' }).provider).to.eql('dropbox');
    })
  });

  describe('id', function () {
    it('returns a numberical id', function () {
      expect(factory().id).to.be.a('number');
      expect(factory().id.toString()).to.have.length(10);
    });

    it('returns a 10 character id', function () {
      expect(factory().id).to.be.a('number');
      expect(factory().id.toString()).to.have.length(10);
    });

    it('can be overwritten', function () {
      var profile = factory({ id: 1234 });
      expect(profile.id).to.eql(1234);
      expect(profile.id).to.eql(profile._json.uid);
    });

    it('matches the _json uuid', function () {
      var profile = factory();
      expect(profile.id).to.eql(profile._json.uid);
    });
  });

  describe('displayName', function () {
    it('returns a two part string', function () {
      expect(factory().displayName).to.match(/\w+ \w+/)
    });

    it('is comprised of the first name and last name', function () {
      var profile = factory();
      expect(profile.displayName).to.eql(profile._json.name_details.given_name + ' ' + profile._json.name_details.surname);
    });

    it('can be overwritten just first name', function () {
      var profile = factory({ firstName: 'Galatea' });
      expect(profile.displayName.split(' ')[0]).to.eql('Galatea');
      expect(profile._json.name_details.given_name).to.eql('Galatea');
    });

    it('can be overwritten just last name', function () {
      var profile = factory({ lastName: 'Dunkel' });
      expect(profile.displayName.split(' ')[1]).to.eql('Dunkel');
      expect(profile._json.name_details.surname).to.eql('Dunkel');
    });

    it('can be overwritten completely', function () {
      var profile = factory({ firstName: 'Randall', lastName: 'Dunkel' });
      expect(profile.displayName).to.eql('Randall Dunkel');
      expect(profile._json.name_details.surname).to.eql('Dunkel');
    });
  });

  describe('emails', function () {
    it('matches the format', function () {
      var profile = factory();
      expect(profile.emails[0].email).to.match(/\w+\.\w+@example\.com/)
    });

    it('matches the _json', function () {
      var profile = factory();
      expect(profile.emails[0].email).to.eql(profile._json.email);
    });

    it('can be overwritten', function () {
      var profile = factory({ email: 'test@test.test' });
      expect(profile.emails[0].email).to.eql('test@test.test')
      expect(profile._json.email).to.eql('test@test.test')
    });

    it('is built from firstName, lastName', function () {
      var profile = factory({ firstName: 'bob', lastName: 'Mac Dougal' });
      expect(profile.emails[0].email).to.eql('bob.macdougal@example.com');
      expect(profile._json.email).to.eql('bob.macdougal@example.com');
    });
  });

  describe('_raw', function () {
    it('is the string version of _json', function () {
      var profile = factory();
      expect(profile._raw).to.eql(JSON.stringify(profile._json, null, 4));
    });
  });

  describe('_json', function (){
    describe('name_details', function (){
      describe('given_name', function (){
        it('returns a string', function () {
          expect(factory()._json.name_details.given_name).to.be.a('string');
        });

        it('can be over written', function () {
          expect(factory({ firstName: 'Randall' })._json.name_details.given_name).to.eql('Randall');
        });
      });

      describe('surname', function (){
        it('returns a string', function () {
          expect(factory()._json.name_details.surname).to.be.a('string');
        });

        it('can be over written', function () {
          expect(factory({ lastName: 'Wiggins' })._json.name_details.surname).to.eql('Wiggins');
        });
      });

      describe('familiar_name', function (){
        it('returns a string', function () {
          expect(factory()._json.name_details.familiar_name).to.be.a('string');
        });

        it('can be over written', function () {
          expect(factory({ nickName: 'Boo' })._json.name_details.familiar_name).to.eql('Boo');
        });
      });
    });

    describe('team', function () {
      describe('team_id', function () {
        it('matches the correct format', function () {
          expect(factory()._json.team.team_id).to.match(/dbtid: \w{10}/)
        });

        it('can be overwritten', function () {
          expect(factory({ team_id: 'teamy team' })._json.team.team_id).to.eql('teamy team');
        });
      });

      describe('name', function () {
        it('is a string', function () {
          expect(factory()._json.team.name).to.be.a('string');
        });

        it('can be overwritten', function () {
          expect(factory({ team_name: 'my awesome team' })._json.team.name).to.eql('my awesome team');
        });
      });
    });

    describe('quota_info', function () {
      describe('datastores', function () {
        it('is a number of length 20', function () {
          var datastores = factory()._json.quota_info.datastores;
          expect(datastores).to.be.a('number')
          expect(datastores.toString()).to.have.length(20);
        });

        it('can be overwritten', function () {
          expect(factory({ datastores: 20 })._json.quota_info.datastores).to.eql(20);
        });
      });

      describe('shared', function () {
        it('is a number of length 20', function () {
          var shared = factory()._json.quota_info.shared;
          expect(shared).to.be.a('number')
          expect(shared.toString()).to.have.length(17);
        });

        it('can be overwritten', function () {
          expect(factory({ shared: 20 })._json.quota_info.shared).to.eql(20);
        });
      });

      describe('quota', function () {
        it('is a number of length 20', function () {
          var quota = factory()._json.quota_info.quota;
          expect(quota).to.be.a('number')
          expect(quota.toString()).to.have.length(18);
        });

        it('can be overwritten', function () {
          expect(factory({ quota: 20 })._json.quota_info.quota).to.eql(20);
        });
      });

      describe('normal', function () {
        it('is a number of length 20', function () {
          var normal = factory()._json.quota_info.normal;
          expect(normal).to.be.a('number')
          expect(normal.toString()).to.have.length(17);
        });

        it('can be overwritten', function () {
          expect(factory({ normal: 20 })._json.quota_info.normal).to.eql(20);
        });
      });
    });

    describe('referral_link', function () {
      it('is the correct format', function () {
        var referral_link = factory()._json.referral_link;
        expect(referral_link).to.be.a('string')
        expect(referral_link).to.match(/https:\/\/db\.tt\/\w{10}/)
      });

      it('can be overwritten', function () {
        expect(factory({ referralLink: 'sup.com' })._json.referral_link).to.eql('sup.com');
      });
    });

    describe('uid', function () {
      it('is tested in profile.id');
    });

    describe('locale', function () {
      it('returns en', function () {
        expect(factory()._json.locale).to.eql('en');
      });

      it('can be overwritten', function () {
        expect(factory({ locale: 'es' })._json.locale).to.eql('es');
      });
    });

    describe('country', function () {
      it('returns US', function () {
        expect(factory()._json.country).to.eql('US');
      });

      it('can be overwritten', function () {
        expect(factory({ country: 'ES' })._json.country).to.eql('ES');
      });
    });

    describe('is_paired', function () {
      it('returns a bool', function () {
        expect(factory()._json.is_paired).to.be.a('boolean')
        expect(factory()._json.is_paired).to.be.false
      });

      it('can be overwritten', function () {
        expect(factory({ isPaired: true })._json.is_paired).to.be.true
      });
    });

    describe('email_verified', function () {
      it('returns a bool', function () {
        expect(factory()._json.email_verified).to.be.a('boolean')
        expect(factory()._json.email_verified).to.be.true
      });

      it('can be overwritten', function () {
        expect(factory({ emailVerified: false })._json.email_verified).to.be.false
      });
    });
  });
});
