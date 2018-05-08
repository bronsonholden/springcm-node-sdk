const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('get-document', function () {
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

  it('get document by path', function (done) {
    springCm.getDocument('/Test.pdf', (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      done();
    });
  });

  it('get document by UID', function (done) {
    springCm.getDocument('0063805f-9b42-e811-9c12-3ca82a1e3f41', (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      done();
    });
  });

  it('get document by reference', function (done) {
    springCm.getDocument('/Test.pdf', (err, d1) => {
      expect(err).to.not.exist;
      expect(d1).to.exist;

      springCm.getDocument(d1, (err, d2) => {
        expect(err).to.not.exist;
        expect(d2).to.exist;
        // Should be the same document...
        expect(d1.getUid()).to.equal(d2.getUid());

        done();
      });
    });
  });
});
