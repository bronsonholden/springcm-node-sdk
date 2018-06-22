const { describe, it } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');

describe('spoof-rate-limit', function () {
  it('calls user-specified callback once', function (done) {
    this.timeout(5000);

    var springCm = new SpringCM({
      clientId: '',
      clientSecret: '',
      dataCenter: ''
    });

    springCm.enqueueRequest({
      method: 'GET',
      baseUrl: 'https://www.google.com',
      uri: '/'
    }, 0, {
      spoofRateLimit: true
    }, (err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
