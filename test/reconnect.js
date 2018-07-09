/**
 * This test doesn't really do anything at the moment, but was used for
 * testing reconnect timers with very low timeout durations. In the future,
 * the SDK may include max auth token lifetimes, so reconnects are done
 * at configured intervals, in which case we can test this.
 */

const { describe, it, before, after } = require('mocha');
const SpringCM = require('../');
const env = require('./env');

describe('reconnect', function () {
  var springCm;

  this.timeout(20000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect(done);
  });

  after(function (done) {
    springCm.close(done);
  });

  // it('reconnect on authtoken expiry', function (done) {
  //   setTimeout(done, 1000);
  // });
});
