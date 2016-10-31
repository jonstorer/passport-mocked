var utils = require('./utils');
var faker = require('faker');

module.exports = function Legalshield (params) {
  params = params || { };
  params.address = params.address || {};
  params.fulfillment_partner = params.fulfillment_partner || {};
  params.emergency_contact = params.emergency_contact || {};
  params.access_control = params.access_control || {};

  var id = (params.id || utils.makeNumber(10)) ;
  var firstName = (params.firstName || faker.name.firstName());
  var lastName = (params.lastName || faker.name.lastName());
  var displayName = (params.displayName || firstName + ' ' + lastName);
  var email = (params.email || utils.makeEmail(firstName, lastName));
  var json = {
    Member: {
      id: id,
      account_type: "Member",
      provider: "legalshield",
      displayName: displayName,
      name: {
        givenName: firstName,
        middleName: "",
        familyName: lastName
      },
      emails: [
        {
        value: email,
        type: "home"
        }
      ],
      _json: {
        type: "LegalShield",
        first_name: firstName,
        last_name: lastName,
        membership_number: id,
        day_time_phone_number: null,
        home_phone_number: null,
        cell_phone_number: (params.cellphone || faker.phone.phoneNumber()),
        last_4_of_tax_id: (params.ssn || utils.makeNumber(4)),
        date_of_birth: (params.dob || faker.date.past()),
        fulfillment_partner: {
          phone: (params.fulfillment_partner.phone || faker.phone.phoneNumber()),
          name: (params.fulfillment_partner.name || faker.company.companyName()),
          vendor_number: (params.fulfillment_partner.vendor_number || utils.makeNumber(6))
        },
        customer_service: {
          phone: "800-654-7757",
          email: "mobileapp@legalshield.com"
        },
        emergency_contact: {
          phone: (params.emergency_contact.phone || faker.phone.phoneNumber())
        },
        sub_type_category: "Personal",
        email_address: email,
        access_control: {
          allow_emergency_access: (params.access_control.allow_emergency_access || false),
          allow_will_preparation: (params.access_control.allow_will_preparation || false),
          allow_idshield_dashboard: (params.access_control.allow_idshield_dashboard || false),
          allow_speeding_ticket_upload: (params.access_control.allow_speeding_ticket_upload || false),
          allow_member_perks: (params.access_control.allow_member_perks || false)
        },
        address: {
          street: (params.address.street || faker.address.streetAddress()),
          street_2: (params.address.street_2 || null) ,
          city: (params.address.city || faker.address.city()),
          state: (params.address.state || faker.address.stateAbbr()) ,
          postal_code: (params.address.postal_code || faker.address.zipCode()),
          country_code: (params.address.country_code || faker.address.countryCode())
        },
        sub_type: (params.sub_type || "Regular Family Plan"),
        plan_display_name: "Family Plan",
        is_individual_plan: false,
        plan_code: (params.plan_code || utils.makeNumber(3)),
        is_precancel_status: false,
        has_core_client_access: true
      },
    },
    basic_profile: {
      id: id,
      login: (params.login || faker.internet.userName),
      email: null,
      first_name: null,
      last_name: null,
      is_member: ( typeof params.is_member === 'undefined' || params.is_member === null ? true : params.is_member ),
      is_provider: (params.is_provider || false),
      is_associate: (params.is_associate || false),
      is_broker: (params.is_broker || false)
    }
  };

  return {
    provider: 'legalshield',
    id: id,
    displayName: displayName,
    emails: [ { email: email } ],
    _raw: JSON.stringify(json, null, 4),
    _json: json
  };
};
