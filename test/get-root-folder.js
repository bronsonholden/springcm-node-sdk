const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('get-root-folder', function () {
  var springCm;

  this.timeout(10000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect((err) => {
      expect(err).to.not.exist;
      done();
    });
  });

  after(function (done) {
    springCm.close(done);
  });

  it('returns root folder', function (done) {
    springCm.getRootFolder((err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      done();
    });
  });
});
