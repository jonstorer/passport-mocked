var Factory = require('../../lib/passport-mock/factory')
  , expect = require('chai').expect
  , sinon = require('sinon');

describe('.add', function () {
  it('registers a factory function', function () {
    var factory = new Factory();
    factory.add('tmp', function () { return 'whatever' });
    expect(factory.build('tmp')).to.eql('whatever');
  });
});

describe('.build', function () {
  beforeEach(function() {
    factory = new Factory();
  });

  it('passes arguments into the factory', function () {
    factory.add('myFactory', function (value) { return 'hey' + value; });
    expect(factory.build('myFactory', 'sup')).to.eql('heysup');
  });

  it('throws an error if the factory is not defined', function () {
    expect(function (){ factory.build('myFactory', {}); }).to.throw(TypeError);
    expect(function (){ factory.build('myFactory', {}); }).to.throw(/myFactory has not been defined/);
  });
});

describe('.isDefined', function () {
  beforeEach(function() { factory = new Factory(); });

  it('passes arguments into the factory', function () {
    factory.add('myFactory', function (value) { return 'hey' + value; });
    expect(factory.isDefined('myFactory')).to.be.true;
  });

  it('throws an error if the factory is not defined', function () {
    expect(factory.isDefined('myFactory')).to.be.false;
  });
});
