const { describe, it } = require('mocha');
const { expect } = require('chai');
const _ = require('lodash');
const SpringCM = require('../');
const env = require('./env');

describe('client', function () {
  this.timeout(10000);

  it('connect and close', function (done) {
    var springCm = new SpringCM(env);

    springCm.connect((err) => {
      expect(err).to.not.exist;

      springCm.close(done);
    });
  });

  it('handles invalid clientId', function (done) {
    var springCm = new SpringCM(_.defaults({
      clientId: 'invalid'
    }, env));

    springCm.connect((err) => {
      expect(err).to.be.an('error');
      done();
    });
  });

  it('handles invalid clientSecret', function (done) {
    var springCm = new SpringCM(_.defaults({
      clientSecret: 'invalid'
    }, env));

    springCm.connect((err) => {
      expect(err).to.be.an('error');
      done();
    });
  });

  it('handles invalid dataCenter', function (done) {
    var springCm = new SpringCM(_.defaults({
      dataCenter: 'invalid'
    }, env));

    springCm.connect((err) => {
      expect(err).to.be.an('error');
      done();
    });
  });
});
