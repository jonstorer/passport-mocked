var Factory = require('../../lib/passport-mock/factory')
  , expect = require('chai').expect
  , sinon = require('sinon');

describe('.add', function () {
  var factory;
  beforeEach(function() {
    factory = new Factory();
  });

  it('registers a factory function', function () {
    factory.add('tmp', function () { return 'whatever' });
    expect(factory.build('tmp')).to.eql('whatever');
  });

  it('passes arguments into the factory', function () {
    factory.add('new factory', function (value) { return 'hey' + value; });
    expect(factory.build('new factory', 'sup')).to.eql('heysup');
  });
});
